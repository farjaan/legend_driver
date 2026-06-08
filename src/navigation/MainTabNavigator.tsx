import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@features/home/HomeScreen';
import { JobInboxScreen } from '@features/jobs/JobInboxScreen';
import { ChatListScreen } from '@features/chat/ChatListScreen';
import { ChatConversationScreen } from '@features/chat/ChatConversationScreen';
import { ProfileScreen } from '@features/profile/ProfileScreen';
import { EditProfileScreen } from '@features/profile/EditProfileScreen';
import { KycWizardScreen } from '@features/profile/KycWizardScreen';
import { ComplianceScreen } from '@features/profile/ComplianceScreen';
import { IncidentReportScreen } from '@features/profile/IncidentReportScreen';
import { SettingsScreen } from '@features/profile/SettingsScreen';
import { MyVehiclesScreen } from '@features/profile/MyVehiclesScreen';
import { NotificationsScreen } from '@features/notifications/NotificationsScreen';
import { RatingsScreen } from '@features/profile/RatingsScreen';
import { PenaltiesScreen } from '@features/profile/PenaltiesScreen';
import { BreakdownListScreen } from '@features/breakdown/BreakdownListScreen';
import { BreakdownDetailScreen } from '@features/breakdown/BreakdownDetailScreen';
import { EarningsScreen } from '@features/earnings/EarningsScreen';
import { SupportTicketListScreen } from '@features/support/SupportTicketListScreen';
import { CreateSupportTicketScreen } from '@features/support/CreateSupportTicketScreen';
import { SupportTicketDetailScreen } from '@features/support/SupportTicketDetailScreen';
import { DocumentsScreen } from '@features/profile/DocumentsScreen';
import { DriverCustomTabBar } from '@navigation/DriverCustomTabBar';
import type {
  ChatStackParamList,
  HomeStackParamList,
  JobsStackParamList,
  MainTabParamList,
  ProfileStackParamList,
  VehiclesStackParamList,
} from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const JobsStack = createNativeStackNavigator<JobsStackParamList>();
const ChatStack = createNativeStackNavigator<ChatStackParamList>();
const VehiclesStack = createNativeStackNavigator<VehiclesStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="BreakdownList"
        component={BreakdownListScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="BreakdownDetail"
        component={BreakdownDetailScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Earnings"
        component={EarningsScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="SupportTicketList"
        component={SupportTicketListScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="CreateSupportTicket"
        component={CreateSupportTicketScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="SupportTicketDetail"
        component={SupportTicketDetailScreen}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}

function JobsStackScreen() {
  return (
    <JobsStack.Navigator>
      <JobsStack.Screen
        name="JobInbox"
        component={JobInboxScreen}
        options={{ headerShown: false }}
      />
    </JobsStack.Navigator>
  );
}

function VehiclesStackScreen() {
  return (
    <VehiclesStack.Navigator>
      <VehiclesStack.Screen
        name="MyVehicles"
        component={MyVehiclesScreen}
        options={{ headerShown: false }}
      />
    </VehiclesStack.Navigator>
  );
}

function ChatStackScreen() {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{ headerShown: false }}
      />
      <ChatStack.Screen
        name="ChatConversation"
        component={ChatConversationScreen}
        options={{ headerShown: false }}
      />
    </ChatStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="Documents"
        component={DocumentsScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="Earnings"
        component={EarningsScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="SupportTicketList"
        component={SupportTicketListScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="CreateSupportTicket"
        component={CreateSupportTicketScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="SupportTicketDetail"
        component={SupportTicketDetailScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="KycWizard"
        component={KycWizardScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="Compliance"
        component={ComplianceScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="IncidentReport"
        component={IncidentReportScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="BreakdownList"
        component={BreakdownListScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="BreakdownDetail"
        component={BreakdownDetailScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="Ratings"
        component={RatingsScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="Penalties"
        component={PenaltiesScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ headerShown: false }}
      />
    </ProfileStack.Navigator>
  );
}

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <DriverCustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}>
      <Tab.Screen name="HomeTab" component={HomeStackScreen} />
      <Tab.Screen name="VehiclesTab" component={VehiclesStackScreen} />
      <Tab.Screen name="ChatTab" component={ChatStackScreen} />
      <Tab.Screen name="JobsTab" component={JobsStackScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileStackScreen} />
    </Tab.Navigator>
  );
}
