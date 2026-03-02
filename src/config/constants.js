const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
};

const EVENT_TYPES = {
  SEMINAR: 'seminar',
  WORSHIP: 'worship',
  YOUTH: 'youth',
  PRAYER: 'prayer',
  BIBLE_STUDY: 'bible_study',
  FELLOWSHIP: 'fellowship',
  CONFERENCE: 'conference',
  OTHER: 'other',
};

const SERVICE_TYPES = {
  SUNDAY_MORNING: 'sunday_morning',
  SUNDAY_EVENING: 'sunday_evening',
  WEDNESDAY: 'wednesday',
  FRIDAY_YOUTH: 'friday_youth',
  SATURDAY: 'saturday',
  SPECIAL: 'special',
};

const SONG_GENRES = {
  WORSHIP: 'worship',
  PRAISE: 'praise',
  HYMN: 'hymn',
  GOSPEL: 'gospel',
  CONTEMPORARY: 'contemporary',
  TRADITIONAL: 'traditional',
  CHILDREN: 'children',
};

const VERSE_THEMES = {
  LOVE: 'love',
  FAITH: 'faith',
  HOPE: 'hope',
  SALVATION: 'salvation',
  PRAYER: 'prayer',
  WISDOM: 'wisdom',
  STRENGTH: 'strength',
  PEACE: 'peace',
  FORGIVENESS: 'forgiveness',
  GRACE: 'grace',
};

const DAYS_OF_WEEK = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

module.exports = {
  ROLES,
  EVENT_TYPES,
  SERVICE_TYPES,
  SONG_GENRES,
  VERSE_THEMES,
  DAYS_OF_WEEK,
};
