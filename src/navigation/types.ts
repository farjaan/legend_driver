export type AuthStackParamList = {
  Login: undefined;
  EmployeeLogin: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  Notifications: undefined;
  BreakdownList: undefined;
  BreakdownDetail: { ticketId: string };
};

export type JobsStackParamList = {
  JobInbox: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  KycWizard: undefined;
  Compliance: undefined;
  IncidentReport: undefined;
  Settings: undefined;
  MyVehicles: undefined;
  Ratings: undefined;
  Penalties: undefined;
  Notifications: undefined;
  BreakdownList: undefined;
  BreakdownDetail: { ticketId: string };
};

export type MainTabParamList = {
  HomeTab: undefined;
  JobsTab: undefined;
  ChatTab: undefined;
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
  ChauffeurTrip: { jobId: string };
  TripSummary: { jobId: string };
  ContactCustomer: { jobId: string };
};
