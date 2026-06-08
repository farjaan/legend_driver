export const DriverEndpoints = {
  AUTH: {
    SEND_LOGIN_OTP: '/Driver/Api/sendLoginOTP',
    VERIFY_LOGIN_OTP: '/Driver/Api/verifyLoginOTP',
    LOGIN_EMPLOYEE: '/Driver/Api/loginEmployee',
    REFRESH_TOKEN: '/Driver/Api/refreshToken',
    LOGOUT: '/Driver/Api/logoutDriver',
    PROFILE: '/Driver/Api/fetchDriverProfile',
  },
  JOBS: {
    LIST: '/Driver/Api/fetchJobList',
    DETAIL: '/Driver/Api/fetchJobDetails',
    ACCEPT: '/Driver/Api/acceptJob',
    REJECT: '/Driver/Api/rejectJob',
    UPDATE_STATUS: '/Driver/Api/updateJobStatus',
    POST_LOCATION: '/Driver/Api/postDriverLocation',
  },
  HANDOVER: {
    CHECKOUT: '/Driver/Api/submitCheckout',
    CHECKIN: '/Driver/Api/submitCheckin',
    VERIFY_OTP: '/Driver/Api/verifyHandoverOtp',
    VERIFY_QR: '/Driver/Api/verifyHandoverQr',
  },
  CHAUFFEUR: {
    TRIP_DETAIL: '/Driver/Api/fetchChauffeurTrip',
    ARRIVE: '/Driver/Api/arriveChauffeurPickup',
    START: '/Driver/Api/startChauffeurTrip',
    END: '/Driver/Api/endChauffeurTrip',
  },
  BREAKDOWN: {
    LIST: '/Driver/Api/fetchBreakdownTickets',
    UPDATE: '/Driver/Api/updateBreakdownTicket',
  },
  CHAT: {
    THREADS: '/Driver/Api/fetchChatThreads',
    DISPATCH_MESSAGES: '/Driver/Api/fetchDispatchChat',
    SEND_DISPATCH: '/Driver/Api/sendDispatchMessage',
  },
  PROFILE: {
    SUMMARY: '/Driver/Api/fetchDriverSummary',
    RATINGS: '/Driver/Api/fetchDriverRatings',
    PENALTIES: '/Driver/Api/fetchDriverPenalties',
    SHIFT: '/Driver/Api/updateShiftStatus',
    UPDATE: '/Driver/Api/updateDriverProfile',
  },
  NOTIFICATIONS: {
    LIST: '/Driver/Api/fetchDriverNotifications',
  },
  EARNINGS: {
    SUMMARY: '/Driver/Api/fetchDriverEarnings',
  },
  SUPPORT: {
    LIST: '/Driver/Api/fetchSupportTickets',
    CREATE: '/Driver/Api/createSupportTicket',
    REPLY: '/Driver/Api/replySupportTicket',
  },
  INCIDENT: {
    SUBMIT: '/Driver/Api/submitIncidentReport',
  },
} as const;
