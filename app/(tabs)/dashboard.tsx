import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAttendees } from '../../src/context/AttendeeContext';
import { useAuth } from '../../src/context/AuthContext';
import { useEvent } from '../../src/context/EventContext';

function StatCard({
  icon,
  label,
  value,
  color = '#111827',
}: {
  icon: string;
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon as any} size={20} color={color} style={styles.statIcon} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const { attendees, isLoading, sessionCheckIns } = useAttendees();
  const { staff } = useAuth();
  const { activeAssignment } = useEvent();

  const total = attendees.length;
  const checkedIn = useMemo(() => attendees.filter((a) => a.checkedIn).length, [attendees]);
  const remaining = total - checkedIn;
  const rate = total > 0 ? Math.round((checkedIn / total) * 100) : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Event stats */}
      <Text style={styles.sectionLabel}>Event Overview</Text>

      {isLoading ? (
        <View style={styles.loadingCard}>
          <Text style={styles.loadingText}>Loading stats...</Text>
        </View>
      ) : (
        <>
          <View style={styles.statRow}>
            <StatCard icon="people-outline" label="Registered" value={total} />
            <StatCard icon="checkmark-circle-outline" label="Checked In" value={checkedIn} color="#16A34A" />
            <StatCard icon="time-outline" label="Remaining" value={remaining} color="#D97706" />
          </View>

          {/* Check-in rate */}
          <View style={styles.rateCard}>
            <View style={styles.rateHeader}>
              <Text style={styles.rateLabel}>Check-in Rate</Text>
              <Text style={styles.rateValue}>{rate}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${rate}%` }]} />
            </View>
          </View>
        </>
      )}

      {/* Personal stats */}
      <Text style={[styles.sectionLabel, { marginTop: 28 }]}>Your Session</Text>
      <View style={styles.personalCard}>
        <Ionicons name="person-circle-outline" size={36} color="#6B7280" style={styles.avatar} />
        <Text style={styles.staffName}>{staff?.name ?? 'Staff'}</Text>
        <Text style={styles.staffRole}>
          {activeAssignment?.role ?? 'Check-in Staff'} · {activeAssignment?.event.name ?? '—'}
        </Text>
        <View style={styles.divider} />
        <Text style={styles.sessionCount}>{sessionCheckIns}</Text>
        <Text style={styles.sessionLabel}>check-ins this session</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 4,
  },
  loadingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  statRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    marginBottom: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  statLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  rateCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  rateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rateLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  rateValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 99,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 99,
  },
  personalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  avatar: {
    marginBottom: 8,
  },
  staffName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  staffRole: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
    textAlign: 'center',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 20,
  },
  sessionCount: {
    fontSize: 48,
    fontWeight: '800',
    color: '#111827',
  },
  sessionLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
});
