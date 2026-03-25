import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { EventProvider } from '../../src/context/EventContext';
import { AttendeeProvider } from '../../src/context/AttendeeContext';
import EventHeader from '../../src/components/EventHeader';
import EventSwitcherDrawer from '../../src/components/EventSwitcherDrawer';

function ScanTabIcon() {
  return (
    <View style={styles.scanButton}>
      <Ionicons name="qr-code-outline" size={24} color="#fff" />
    </View>
  );
}

function TabsWithHeader() {
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <View style={styles.flex}>
      <EventHeader onOpenDrawer={() => setDrawerVisible(true)} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#111827',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tabs.Screen
          name="attendees"
          options={{
            title: 'Attendees',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="scan"
          options={{
            title: '',
            tabBarIcon: () => <ScanTabIcon />,
          }}
        />
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bar-chart-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      <EventSwitcherDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <EventProvider>
      <AttendeeProvider>
        <SafeAreaView style={styles.flex} edges={['top']}>
          <TabsWithHeader />
        </SafeAreaView>
      </AttendeeProvider>
    </EventProvider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabBar: {
    borderTopColor: '#E5E7EB',
    backgroundColor: '#fff',
    height: 64,
    paddingBottom: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  scanButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
