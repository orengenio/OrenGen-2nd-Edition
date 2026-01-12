// Smart Scheduler Service (Calendly/Cal.com/OrenCal competitor)
// Advanced scheduling with AI optimization, round-robin, collective booking

export interface SchedulerUser {
  id: string;
  name: string;
  email: string;
  timezone: string;
  availability: WeeklyAvailability;
  connected_calendars: ConnectedCalendar[];
  booking_page_url: string;
  brand: UserBrand;
}

export interface UserBrand {
  logo?: string;
  primary_color: string;
  background_color: string;
  custom_css?: string;
}

export interface WeeklyAvailability {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface ConnectedCalendar {
  id: string;
  provider: 'google' | 'outlook' | 'apple' | 'caldav';
  email: string;
  name: string;
  check_for_conflicts: boolean;
  add_events_to: boolean;
}

export interface EventType {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description: string;
  duration: number;
  buffer_before: number;
  buffer_after: number;
  color: string;
  location: EventLocation;
  questions: BookingQuestion[];
  scheduling: SchedulingSettings;
  notifications: NotificationSettings;
  payments?: PaymentSettings;
  team?: TeamSettings;
  active: boolean;
  bookings_count: number;
}

export interface EventLocation {
  type: 'video' | 'phone' | 'in_person' | 'custom';
  value: string;
  provider?: 'zoom' | 'google_meet' | 'teams' | 'orenmet';
  phone_number?: string;
  address?: string;
}

export interface BookingQuestion {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'phone' | 'email';
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface SchedulingSettings {
  min_notice: number;
  max_advance: number;
  slot_interval: number;
  max_per_day?: number;
  require_confirmation: boolean;
  allow_reschedule: boolean;
  allow_cancel: boolean;
  cancel_notice: number;
}

export interface NotificationSettings {
  confirmation_email: boolean;
  reminder_emails: number[];
  reminder_sms: boolean;
  calendar_invite: boolean;
  custom_message?: string;
}

export interface PaymentSettings {
  enabled: boolean;
  amount: number;
  currency: string;
  provider: 'stripe' | 'paypal';
  collect_on: 'booking' | 'completion';
}

export interface TeamSettings {
  type: 'round_robin' | 'collective' | 'managed';
  members: TeamMember[];
  distribution: 'equal' | 'availability' | 'priority';
}

export interface TeamMember {
  user_id: string;
  name: string;
  email: string;
  priority: number;
  max_bookings_per_day?: number;
}

export interface Booking {
  id: string;
  event_type_id: string;
  host_id: string;
  guest: GuestInfo;
  datetime: Date;
  end_datetime: Date;
  timezone: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no_show';
  location: EventLocation;
  meeting_url?: string;
  answers: { question_id: string; answer: string }[];
  payment?: {
    status: 'pending' | 'paid' | 'refunded';
    amount: number;
    transaction_id?: string;
  };
  notes?: string;
  calendar_event_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface GuestInfo {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  timezone: string;
}

export interface AvailableSlot {
  datetime: Date;
  end_datetime: Date;
  host_id?: string;
  host_name?: string;
}

export interface BookingLink {
  id: string;
  event_type_id: string;
  type: 'single_use' | 'multi_use' | 'expires';
  url: string;
  expires_at?: Date;
  max_uses?: number;
  uses: number;
  prefilled_data?: Record<string, string>;
  routing_rules?: RoutingRule[];
}

export interface RoutingRule {
  id: string;
  condition: {
    field: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
    value: string;
  };
  action: {
    type: 'assign_to' | 'redirect' | 'show_message';
    value: string;
  };
}

export interface SchedulerAnalytics {
  period: 'day' | 'week' | 'month' | 'year';
  total_bookings: number;
  completed_bookings: number;
  cancelled_bookings: number;
  no_shows: number;
  average_booking_value: number;
  total_revenue: number;
  popular_times: { hour: number; day: string; count: number }[];
  conversion_rate: number;
  page_views: number;
}

class SmartSchedulerService {
  private users: Map<string, SchedulerUser> = new Map();
  private eventTypes: Map<string, EventType> = new Map();
  private bookings: Map<string, Booking> = new Map();
  private bookingLinks: Map<string, BookingLink> = new Map();

  // User Management
  async createUser(config: {
    name: string;
    email: string;
    timezone: string;
  }): Promise<SchedulerUser> {
    const user: SchedulerUser = {
      id: `user_${Date.now()}`,
      name: config.name,
      email: config.email,
      timezone: config.timezone,
      availability: this.getDefaultAvailability(),
      connected_calendars: [],
      booking_page_url: `https://cal.orengen.io/${config.name.toLowerCase().replace(/\s+/g, '-')}`,
      brand: {
        primary_color: '#f97316',
        background_color: '#0a0a0a'
      }
    };

    this.users.set(user.id, user);
    return user;
  }

  private getDefaultAvailability(): WeeklyAvailability {
    const workday = [{ start: '09:00', end: '17:00' }];
    return {
      monday: workday,
      tuesday: workday,
      wednesday: workday,
      thursday: workday,
      friday: workday,
      saturday: [],
      sunday: []
    };
  }

  async updateAvailability(user_id: string, availability: WeeklyAvailability): Promise<void> {
    const user = this.users.get(user_id);
    if (!user) throw new Error('User not found');
    user.availability = availability;
  }

  async connectCalendar(user_id: string, config: {
    provider: ConnectedCalendar['provider'];
    oauth_token?: string;
    caldav_url?: string;
  }): Promise<ConnectedCalendar> {
    const user = this.users.get(user_id);
    if (!user) throw new Error('User not found');

    const calendar: ConnectedCalendar = {
      id: `cal_${Date.now()}`,
      provider: config.provider,
      email: user.email,
      name: `${config.provider} Calendar`,
      check_for_conflicts: true,
      add_events_to: true
    };

    user.connected_calendars.push(calendar);
    return calendar;
  }

  // Event Type Management
  async createEventType(config: {
    user_id: string;
    name: string;
    duration: number;
    description?: string;
    location?: Partial<EventLocation>;
    questions?: Omit<BookingQuestion, 'id'>[];
    team?: Omit<TeamSettings, 'members'> & { member_ids: string[] };
  }): Promise<EventType> {
    const eventType: EventType = {
      id: `evt_${Date.now()}`,
      user_id: config.user_id,
      name: config.name,
      slug: config.name.toLowerCase().replace(/\s+/g, '-'),
      description: config.description || '',
      duration: config.duration,
      buffer_before: 0,
      buffer_after: 0,
      color: '#f97316',
      location: {
        type: 'video',
        value: 'OrenMeet',
        provider: 'orenmet',
        ...config.location
      },
      questions: [
        { id: 'q_name', type: 'text', label: 'Your Name', required: true },
        { id: 'q_email', type: 'email', label: 'Email Address', required: true },
        ...(config.questions?.map((q, i) => ({ ...q, id: `q_${Date.now()}_${i}` })) || [])
      ],
      scheduling: {
        min_notice: 60,
        max_advance: 60 * 24 * 60,
        slot_interval: 15,
        require_confirmation: false,
        allow_reschedule: true,
        allow_cancel: true,
        cancel_notice: 60
      },
      notifications: {
        confirmation_email: true,
        reminder_emails: [1440, 60],
        reminder_sms: false,
        calendar_invite: true
      },
      team: config.team ? {
        type: config.team.type,
        distribution: config.team.distribution || 'equal',
        members: config.team.member_ids.map((id, i) => {
          const user = this.users.get(id);
          return {
            user_id: id,
            name: user?.name || 'Team Member',
            email: user?.email || '',
            priority: i + 1
          };
        })
      } : undefined,
      active: true,
      bookings_count: 0
    };

    this.eventTypes.set(eventType.id, eventType);
    return eventType;
  }

  async updateEventType(event_type_id: string, updates: Partial<EventType>): Promise<EventType> {
    const eventType = this.eventTypes.get(event_type_id);
    if (!eventType) throw new Error('Event type not found');

    Object.assign(eventType, updates);
    return eventType;
  }

  // Availability & Booking
  async getAvailableSlots(event_type_id: string, date_range: {
    start: Date;
    end: Date;
    timezone: string;
  }): Promise<AvailableSlot[]> {
    const eventType = this.eventTypes.get(event_type_id);
    if (!eventType) throw new Error('Event type not found');

    const slots: AvailableSlot[] = [];
    const current = new Date(date_range.start);

    while (current <= date_range.end) {
      const daySlots = await this.getSlotsForDay(eventType, current, date_range.timezone);
      slots.push(...daySlots);
      current.setDate(current.getDate() + 1);
    }

    return slots;
  }

  private async getSlotsForDay(
    eventType: EventType,
    date: Date,
    timezone: string
  ): Promise<AvailableSlot[]> {
    const user = this.users.get(eventType.user_id);
    if (!user) return [];

    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[date.getDay()] as keyof WeeklyAvailability;
    const dayAvailability = user.availability[dayName];

    if (!dayAvailability.length) return [];

    const slots: AvailableSlot[] = [];
    const existingBookings = await this.getBookingsForDay(eventType.id, date);

    for (const window of dayAvailability) {
      const [startHour, startMin] = window.start.split(':').map(Number);
      const [endHour, endMin] = window.end.split(':').map(Number);

      let slotTime = new Date(date);
      slotTime.setHours(startHour, startMin, 0, 0);

      const windowEnd = new Date(date);
      windowEnd.setHours(endHour, endMin, 0, 0);

      while (slotTime < windowEnd) {
        const slotEnd = new Date(slotTime.getTime() + eventType.duration * 60000);

        // Check for conflicts
        const hasConflict = existingBookings.some(booking => {
          const bookingStart = new Date(booking.datetime);
          const bookingEnd = new Date(booking.end_datetime);
          return slotTime < bookingEnd && slotEnd > bookingStart;
        });

        if (!hasConflict && slotEnd <= windowEnd) {
          // For team events, find available host
          let hostId = eventType.user_id;
          let hostName = user.name;

          if (eventType.team) {
            const availableHost = await this.findAvailableTeamMember(eventType.team, slotTime, slotEnd);
            if (availableHost) {
              hostId = availableHost.user_id;
              hostName = availableHost.name;
            } else {
              // No team member available for this slot
              slotTime = new Date(slotTime.getTime() + eventType.scheduling.slot_interval * 60000);
              continue;
            }
          }

          slots.push({
            datetime: new Date(slotTime),
            end_datetime: slotEnd,
            host_id: hostId,
            host_name: hostName
          });
        }

        slotTime = new Date(slotTime.getTime() + eventType.scheduling.slot_interval * 60000);
      }
    }

    return slots;
  }

  private async findAvailableTeamMember(
    team: TeamSettings,
    start: Date,
    end: Date
  ): Promise<TeamMember | null> {
    const sortedMembers = [...team.members].sort((a, b) => {
      if (team.distribution === 'priority') return a.priority - b.priority;
      return 0;
    });

    for (const member of sortedMembers) {
      const memberBookings = Array.from(this.bookings.values())
        .filter(b => b.host_id === member.user_id && b.status !== 'cancelled');

      const hasConflict = memberBookings.some(booking => {
        const bookingStart = new Date(booking.datetime);
        const bookingEnd = new Date(booking.end_datetime);
        return start < bookingEnd && end > bookingStart;
      });

      if (!hasConflict) {
        // Check daily limit
        const todayBookings = memberBookings.filter(b =>
          new Date(b.datetime).toDateString() === start.toDateString()
        ).length;

        if (!member.max_bookings_per_day || todayBookings < member.max_bookings_per_day) {
          return member;
        }
      }
    }

    return null;
  }

  private async getBookingsForDay(event_type_id: string, date: Date): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => {
      if (booking.event_type_id !== event_type_id) return false;
      if (booking.status === 'cancelled') return false;
      const bookingDate = new Date(booking.datetime);
      return bookingDate.toDateString() === date.toDateString();
    });
  }

  // Create Booking
  async createBooking(config: {
    event_type_id: string;
    datetime: Date;
    guest: GuestInfo;
    answers?: { question_id: string; answer: string }[];
    host_id?: string;
  }): Promise<Booking> {
    const eventType = this.eventTypes.get(config.event_type_id);
    if (!eventType) throw new Error('Event type not found');

    // Validate slot is still available
    const slots = await this.getAvailableSlots(config.event_type_id, {
      start: config.datetime,
      end: config.datetime,
      timezone: config.guest.timezone
    });

    const matchingSlot = slots.find(s =>
      s.datetime.getTime() === config.datetime.getTime()
    );

    if (!matchingSlot) {
      throw new Error('Selected time slot is no longer available');
    }

    const booking: Booking = {
      id: `booking_${Date.now()}`,
      event_type_id: config.event_type_id,
      host_id: config.host_id || matchingSlot.host_id || eventType.user_id,
      guest: config.guest,
      datetime: config.datetime,
      end_datetime: new Date(config.datetime.getTime() + eventType.duration * 60000),
      timezone: config.guest.timezone,
      status: eventType.scheduling.require_confirmation ? 'pending' : 'confirmed',
      location: eventType.location,
      meeting_url: eventType.location.type === 'video'
        ? `https://meet.orengen.io/${Date.now()}`
        : undefined,
      answers: config.answers || [],
      created_at: new Date(),
      updated_at: new Date()
    };

    this.bookings.set(booking.id, booking);
    eventType.bookings_count++;

    // Trigger notifications
    await this.sendBookingNotifications(booking, eventType);

    return booking;
  }

  async cancelBooking(booking_id: string, reason?: string): Promise<Booking> {
    const booking = this.bookings.get(booking_id);
    if (!booking) throw new Error('Booking not found');

    booking.status = 'cancelled';
    booking.notes = reason ? `Cancelled: ${reason}` : 'Cancelled';
    booking.updated_at = new Date();

    return booking;
  }

  async rescheduleBooking(booking_id: string, new_datetime: Date): Promise<Booking> {
    const booking = this.bookings.get(booking_id);
    if (!booking) throw new Error('Booking not found');

    const eventType = this.eventTypes.get(booking.event_type_id);
    if (!eventType) throw new Error('Event type not found');

    // Validate new slot
    const slots = await this.getAvailableSlots(booking.event_type_id, {
      start: new_datetime,
      end: new_datetime,
      timezone: booking.timezone
    });

    if (!slots.some(s => s.datetime.getTime() === new_datetime.getTime())) {
      throw new Error('Selected time slot is not available');
    }

    booking.datetime = new_datetime;
    booking.end_datetime = new Date(new_datetime.getTime() + eventType.duration * 60000);
    booking.updated_at = new Date();

    return booking;
  }

  // Booking Links
  async createBookingLink(config: {
    event_type_id: string;
    type: BookingLink['type'];
    expires_at?: Date;
    max_uses?: number;
    prefilled_data?: Record<string, string>;
    routing_rules?: Omit<RoutingRule, 'id'>[];
  }): Promise<BookingLink> {
    const link: BookingLink = {
      id: `link_${Date.now()}`,
      event_type_id: config.event_type_id,
      type: config.type,
      url: `https://cal.orengen.io/link/${Date.now()}`,
      expires_at: config.expires_at,
      max_uses: config.max_uses,
      uses: 0,
      prefilled_data: config.prefilled_data,
      routing_rules: config.routing_rules?.map((r, i) => ({ ...r, id: `rule_${i}` }))
    };

    this.bookingLinks.set(link.id, link);
    return link;
  }

  // Notifications
  private async sendBookingNotifications(booking: Booking, eventType: EventType): Promise<void> {
    // In production, this would send actual emails/SMS
    console.log(`Sending confirmation to ${booking.guest.email} for ${eventType.name}`);

    // Schedule reminders
    for (const reminderMinutes of eventType.notifications.reminder_emails) {
      const reminderTime = new Date(booking.datetime.getTime() - reminderMinutes * 60000);
      console.log(`Scheduling reminder for ${reminderTime.toISOString()}`);
    }
  }

  // Analytics
  async getAnalytics(user_id: string, period: SchedulerAnalytics['period']): Promise<SchedulerAnalytics> {
    const userEventTypes = Array.from(this.eventTypes.values())
      .filter(e => e.user_id === user_id);

    const eventTypeIds = new Set(userEventTypes.map(e => e.id));

    const userBookings = Array.from(this.bookings.values())
      .filter(b => eventTypeIds.has(b.event_type_id));

    const periodStart = this.getPeriodStart(period);
    const periodBookings = userBookings.filter(b => new Date(b.created_at) >= periodStart);

    // Calculate popular times
    const timeCounts = new Map<string, number>();
    periodBookings.forEach(b => {
      const d = new Date(b.datetime);
      const key = `${d.getDay()}-${d.getHours()}`;
      timeCounts.set(key, (timeCounts.get(key) || 0) + 1);
    });

    const popularTimes = Array.from(timeCounts.entries())
      .map(([key, count]) => {
        const [day, hour] = key.split('-').map(Number);
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return { hour, day: dayNames[day], count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      period,
      total_bookings: periodBookings.length,
      completed_bookings: periodBookings.filter(b => b.status === 'completed').length,
      cancelled_bookings: periodBookings.filter(b => b.status === 'cancelled').length,
      no_shows: periodBookings.filter(b => b.status === 'no_show').length,
      average_booking_value: periodBookings.reduce((sum, b) => sum + (b.payment?.amount || 0), 0) / (periodBookings.length || 1),
      total_revenue: periodBookings.reduce((sum, b) => sum + (b.payment?.amount || 0), 0),
      popular_times: popularTimes,
      conversion_rate: 0.35, // Would be calculated from page views
      page_views: 1000 // Would come from analytics
    };
  }

  private getPeriodStart(period: SchedulerAnalytics['period']): Date {
    const now = new Date();
    switch (period) {
      case 'day': return new Date(now.setDate(now.getDate() - 1));
      case 'week': return new Date(now.setDate(now.getDate() - 7));
      case 'month': return new Date(now.setMonth(now.getMonth() - 1));
      case 'year': return new Date(now.setFullYear(now.getFullYear() - 1));
    }
  }

  // Getters
  async getUser(id: string): Promise<SchedulerUser | undefined> {
    return this.users.get(id);
  }

  async getEventTypes(user_id?: string): Promise<EventType[]> {
    const types = Array.from(this.eventTypes.values());
    return user_id ? types.filter(e => e.user_id === user_id) : types;
  }

  async getEventType(id: string): Promise<EventType | undefined> {
    return this.eventTypes.get(id);
  }

  async getBookings(filters?: {
    user_id?: string;
    event_type_id?: string;
    status?: Booking['status'];
    from?: Date;
    to?: Date;
  }): Promise<Booking[]> {
    let bookings = Array.from(this.bookings.values());

    if (filters?.user_id) bookings = bookings.filter(b => b.host_id === filters.user_id);
    if (filters?.event_type_id) bookings = bookings.filter(b => b.event_type_id === filters.event_type_id);
    if (filters?.status) bookings = bookings.filter(b => b.status === filters.status);
    if (filters?.from) bookings = bookings.filter(b => new Date(b.datetime) >= filters.from!);
    if (filters?.to) bookings = bookings.filter(b => new Date(b.datetime) <= filters.to!);

    return bookings.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }
}

export const smartSchedulerService = new SmartSchedulerService();
