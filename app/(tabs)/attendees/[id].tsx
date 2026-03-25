import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAttendees } from '../../../src/context/AttendeeContext';

export default function AttendeeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { attendees, checkIn } = useAttendees();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [justCheckedIn, setJustCheckedIn] = useState(false);

  const attendee = attendees.find(
    (a) => a.registrationId.toUpperCase() === id?.toUpperCase()
  );

  if (!attendee) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFoundText}>Attendee not found.</Text>
      </View>
    );
  }

  const handleCheckIn = () => {
    if (processing) return;
    setProcessing(true);
    setTimeout(() => {
      checkIn(attendee.registrationId);
      setJustCheckedIn(true);
      setProcessing(false);
    }, 300);
  };

  const displayAttendee = attendees.find(
    (a) => a.registrationId.toUpperCase() === id?.toUpperCase()
  ) ?? attendee;

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
        <Ionicons name="chevron-back" size={20} color="#111827" />
        <Text style={styles.backText}>Attendees</Text>
      </TouchableOpacity>

      {/* Profile card */}
      <View style={styles.card}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitial}>
            {displayAttendee.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{displayAttendee.name}</Text>
        <Text style={styles.regId}>{displayAttendee.registrationId}</Text>

        <View style={[styles.badge, displayAttendee.checkedIn ? styles.badgeIn : styles.badgeOut]}>
          <Text style={[styles.badgeText, displayAttendee.checkedIn ? styles.badgeTextIn : styles.badgeTextOut]}>
            {displayAttendee.checkedIn ? 'Checked In' : 'Not Yet'}
          </Text>
        </View>
      </View>

      {/* Entry history */}
      <View style={styles.historyCard}>
        <View style={styles.historyHeader}>
          <Ionicons name="enter-outline" size={18} color="#6B7280" />
          <Text style={styles.historyTitle}>
            {displayAttendee.checkInCount === 0
              ? 'No entries yet'
              : displayAttendee.checkInCount === 1
              ? '1 Entry'
              : `${displayAttendee.checkInCount} Entries`}
          </Text>
        </View>
        {displayAttendee.checkInTimes.length === 0 ? (
          <Text style={styles.noEntryText}>This attendee has not checked in yet.</Text>
        ) : (
          displayAttendee.checkInTimes.map((ts, i) => {
            const d = new Date(ts);
            const date = d.toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' });
            const time = d.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', hour12: true });
            return (
              <View key={i} style={styles.entryRow}>
                <View style={styles.entryBullet} />
                <View style={styles.entryContent}>
                  <Text style={styles.entryIndex}>Entry {i + 1}</Text>
                  <Text style={styles.entryTime}>{date} · {time}</Text>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* Check-in result feedback */}
      {justCheckedIn && (
        <View style={styles.successBanner}>
          <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
          <Text style={styles.successText}>Check-in logged successfully</Text>
        </View>
      )}

      {/* Manual check-in button */}
      <TouchableOpacity
        style={[styles.checkInButton, processing && styles.checkInButtonDisabled]}
        onPress={handleCheckIn}
        disabled={processing}
        activeOpacity={0.8}
      >
        {processing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={styles.checkInButtonText}>Manual Check-In</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 4,
  },
  backText: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarInitial: {
    fontSize: 26,
    fontWeight: '700',
    color: '#374151',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  regId: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 99,
  },
  badgeIn: {
    backgroundColor: '#DCFCE7',
  },
  badgeOut: {
    backgroundColor: '#F3F4F6',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextIn: {
    color: '#16A34A',
  },
  badgeTextOut: {
    color: '#6B7280',
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  noEntryText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  entryBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
    marginTop: 4,
  },
  entryContent: {
    flex: 1,
  },
  entryIndex: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  entryTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  successText: {
    fontSize: 13,
    color: '#16A34A',
    fontWeight: '600',
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#111827',
    borderRadius: 12,
    height: 52,
    marginTop: 4,
  },
  checkInButtonDisabled: {
    opacity: 0.5,
  },
  checkInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
