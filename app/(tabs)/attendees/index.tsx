import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAttendees } from '../../../src/context/AttendeeContext';
import { Attendee } from '../../../src/services/attendees';

function CheckInBadge({ checkedIn }: { checkedIn: boolean }) {
  return (
    <View style={[styles.badge, checkedIn ? styles.badgeIn : styles.badgeOut]}>
      <Text style={[styles.badgeText, checkedIn ? styles.badgeTextIn : styles.badgeTextOut]}>
        {checkedIn ? 'Checked In' : 'Not Yet'}
      </Text>
    </View>
  );
}

function AttendeeRow({ item }: { item: Attendee }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.7}
      onPress={() => router.push(`/attendees/${item.registrationId}`)}
    >
      <View style={styles.rowLeft}>
        <Text style={styles.regId}>{item.registrationId}</Text>
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <View style={styles.rowRight}>
        <CheckInBadge checkedIn={item.checkedIn} />
        <Ionicons name="chevron-forward" size={14} color="#D1D5DB" style={styles.chevron} />
      </View>
    </TouchableOpacity>
  );
}

export default function AttendeesScreen() {
  const { attendees, isLoading } = useAttendees();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return attendees;
    return attendees.filter(
      (a) =>
        a.registrationId.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q)
    );
  }, [attendees, search]);

  const checkedInCount = useMemo(
    () => attendees.filter((a) => a.checkedIn).length,
    [attendees]
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={16} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or registration ID"
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {!isLoading && (
        <View style={styles.summaryBar}>
          <Text style={styles.summaryText}>
            {checkedInCount} / {attendees.length} checked in
          </Text>
          {search ? (
            <Text style={styles.summaryText}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </Text>
          ) : null}
        </View>
      )}

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color="#111827" />
          <Text style={styles.loadingText}>Loading attendees...</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No attendees found.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.registrationId}
          renderItem={({ item }) => <AttendeeRow item={item} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  summaryText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
  },
  rowLeft: {
    flex: 1,
    marginRight: 12,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chevron: {
    marginLeft: 2,
  },
  regId: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  name: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  badgeIn: {
    backgroundColor: '#DCFCE7',
  },
  badgeOut: {
    backgroundColor: '#F3F4F6',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  badgeTextIn: {
    color: '#16A34A',
  },
  badgeTextOut: {
    color: '#6B7280',
  },
  separator: {
    height: 6,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
