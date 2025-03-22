export const Endpoints = {
    ANNOUNCEMENTS: "/announcements",
    PAGINATED_ANNOUNCEMENTS: "/announcements/paginated",
    EDIT_ANNOUNCEMENTS: "/edit-announcement",
    SAVED_ANNOUNCEMENTS: "/saved-announcements",
    UPLOADS: "/uploads",
    FAVORITES: "/users/get-favourites",
    REGISTER: "/auth/register",
    USERS: "/users",
    USERS_BY_EMAIL: "/users/by-email",
    USERS_FIREBASE: "/users/firebase",
    GET_ANNOUNCEMENT_IMAGES: "/uploads",
    PAYMENT_CREATE: "/payment/create",
    PRICING_OPTIONS: "/payment/announcement-options"
  } as const;