import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useEvent } from '../context/EventContext';
import { RRSCEvent, StaffEventAssignment, getEventStatus } from '../services/events';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  Active: '#16A34A',
  Upcoming: '#2563EB',
  Expired: '#9CA3AF',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: STATUS_COLORS[status] + '20' }]}>
      <Text style={[styles.badgeText, { color: STATUS_COLORS[status] }]}>{status}</Text>
    </View>
  );
}

export default function EventSwitcherDrawer({ visible, onClose }: Props) {
  const { signOut } = useAuth();
  const { assignments, activeAssignment, setActiveAssignment } = useEvent();
  const slideAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 12,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 400,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleSelect = (assignment: StaffEventAssignment) => {
    setActiveAssignment(assignment);
    onClose();
  };

  const handleLogout = async () => {
    onClose();
    await signOut();
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View style={[styles.drawer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.handle} />
        <Text style={styles.drawerTitle}>Your Events</Text>

        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {assignments.map((assignment) => {
            const status = getEventStatus(assignment.event);
            const isActive = activeAssignment?.event.id === assignment.event.id;
            return (
              <TouchableOpacity
                key={assignment.event.id}
                style={[styles.eventRow, isActive && styles.eventRowActive]}
                onPress={() => handleSelect(assignment)}
                activeOpacity={0.7}
              >
                <View style={styles.eventRowLeft}>
                  {isActive && (
                    <Ionicons name="checkmark-circle" size={18} color="#111827" style={styles.checkIcon} />
                  )}
                  <View>
                    <Text style={[styles.eventName, isActive && styles.eventNameActive]} numberOfLines={1}>
                      {assignment.event.name}
                    </Text>
                    <Text style={styles.eventRole}>{assignment.role}</Text>
                  </View>
                </View>
                <StatusBadge status={status} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={18} color="#DC2626" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  drawer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '75%',
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  drawerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  list: {
    paddingHorizontal: 20,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  eventRowActive: {
    // subtle highlight handled by text
  },
  eventRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  checkIcon: {
    marginRight: 8,
  },
  eventName: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    flexShrink: 1,
  },
  eventNameActive: {
    color: '#111827',
    fontWeight: '700',
  },
  eventRole: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  logoutText: {
    fontSize: 15,
    color: '#DC2626',
    fontWeight: '500',
  },
});
