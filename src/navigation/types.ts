export type AuthStackParamList = {
  Login: undefined;
  EmployeeLogin: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  Notifications: undefined;
  BreakdownList: undefined;
  BreakdownDetail: { ticketId: string };
  Earnings: undefined;
  SupportTicketList: undefined;
  CreateSupportTicket: undefined;
  SupportTicketDetail: { ticketId: string };
};

/** Shared by Home and Profile stacks — same routes and params in both. */
export type SupportStackParamList = {
  SupportTicketList: undefined;
  CreateSupportTicket: undefined;
  SupportTicketDetail: { ticketId: string };
};

export type JobsStackParamList = {
  JobInbox: undefined;
};

export type VehiclesStackParamList = {
  MyVehicles: undefined;
};

export type ChatStackParamList = {
  ChatList: undefined;
  ChatConversation: {
    threadId: string;
    title: string;
    subtitle: string;
  };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  Documents: undefined;
  KycWizard: undefined;
  Compliance: undefined;
  IncidentReport: undefined;
  Settings: undefined;
  Earnings: undefined;
  SupportTicketList: undefined;
  CreateSupportTicket: undefined;
  SupportTicketDetail: { ticketId: string };
  Ratings: undefined;
  Penalties: undefined;
  Notifications: undefined;
  BreakdownList: undefined;
  BreakdownDetail: { ticketId: string };
};

export type MainTabParamList = {
  HomeTab: undefined;
  VehiclesTab: undefined;
  ChatTab: undefined;
  JobsTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  JobDetail: { jobId: string };
  JobMap: { jobId: string };
  HandoverVerify: { jobId: string };
  CheckoutWizard: { jobId: string };
  CheckinWizard: { jobId: string };
  ChauffeurNavigation: { jobId: string };
  ChauffeurStartTrip: { jobId: string };
  ChauffeurActiveTrip: { jobId: string };
  TripSummary: { jobId: string };
  ContactCustomer: { jobId: string };
};
