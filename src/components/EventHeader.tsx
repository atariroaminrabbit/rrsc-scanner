import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEvent } from '../context/EventContext';
import { getEventStatus } from '../services/events';

const STATUS_COLORS: Record<string, string> = {
  Active: '#16A34A',
  Upcoming: '#2563EB',
  Expired: '#9CA3AF',
};

interface Props {
  onOpenDrawer: () => void;
}

function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-SG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function EventHeader({ onOpenDrawer }: Props) {
  const { activeAssignment, isLoading } = useEvent();

  if (isLoading || !activeAssignment) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading event...</Text>
      </View>
    );
  }

  const { event, role } = activeAssignment;
  const status = getEventStatus(event);
  const statusColor = STATUS_COLORS[status];

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.eventNameRow}
          onPress={onOpenDrawer}
          activeOpacity={0.7}
        >
          <Text style={styles.eventName} numberOfLines={1}>
            {event.name}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#6B7280" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Ionicons name="calendar-outline" size={13} color="#6B7280" />
        <Text style={styles.metaText}>{formatDateTime(event.startTime)}</Text>
      </View>

      <View style={styles.metaRow}>
        <Ionicons name="location-outline" size={13} color="#6B7280" />
        <Text style={styles.metaText}>{event.location}</Text>
      </View>

      <View style={styles.roleRow}>
        <Text style={styles.roleText}>{role}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  loadingText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  eventNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  eventName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    flexShrink: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
  },
  roleRow: {
    marginTop: 6,
  },
  roleText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
