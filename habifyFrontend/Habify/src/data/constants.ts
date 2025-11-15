// src/data/constants.ts
// All UI text and small literal tokens (emojis, labels, placeholders, messages) grouped by page.

export const APP_TEXT = {
  groupDetails: {
    notFound: "Group not found",
    maxStreakTitle: "Max Streak",
    avgStreakTitle: "Average Streak",
    avgStreakSubtitle: "Group average",
    completionTitle: "Completion Rate",
    completionSubtitle: "Average daily completion",
    membersTitle: "Members",
    membersGrowthSuffix: "this week",
    leaderboardTitle: "Top performers",
    weeklyTitle: "Weekly Activity",
    membersTitleFull: "Members",
    addFriendBtn: "Add Friend",
    friendLabel: "Friends ✓",
    viewButton: "View Details",
  },

  social: {
    pageTitle: "Social",
    pageSubtitle: "Connect with friends and join groups to stay motivated",

    tabs: {
      friends: "Friends",
      groups: "Groups",
    },

    addFriendButton: "Add Friend via Link",
    createGroupButton: "Create New Group",

    inviteLabel: "Share your link with friends",
    copyButton: "Copy",

    emptyFriends: {
      title: "No friends yet",
      subtitle: "Add friends to see their progress and compete",
    },

    emptyGroups: {
      title: "No groups yet",
      subtitle: "Create or join a group to collaborate with others",
    },

    travelingTitle: "Traveling Together",
    travelingText:
      "When you and your friends complete tasks, your pets travel together!",

    friendLabels: {
      petLabel: "Pet",
      streakLabel: "day streak",
      gemsLabel: "gems",
    },

    groupLabels: {
      members: "members",
      totalPoints: "total points",
    },

    modals: {
      addFriend: {
        title: "Add Friend",
        instruction: "Share your unique link or enter your friend's code",
        placeholder: "Enter friend code",
        submit: "Add",
      },

      createGroup: {
        title: "Create Group",
        instruction: "Build a group to collaborate and stay motivated",
        nameLabel: "Group Name",
        descriptionLabel: "Description",
        namePlaceholder: "e.g., Morning Hustlers",
        descPlaceholder: "What is your group about?",
        submit: "Create",
      },
    },
  },

  buttons: {
    add: "Add",
    addTask: "Add Task",
    createTask: "Create Task",
    inviteFriend: "Invite Friend",

    viewProfile: "View Profile",
    editProfile: "Edit Profile",
    changeName: "Change Name",
    logout: "Logout",

    leaveGroup: "Leave Group",
    removeFriend: "Remove",
  },

  common: {
    yes: "Yes",
    no: "No",
    cancel: "Cancel",
    save: "Save",
    close: "Close",
    loading: "Loading...",
  },

  nav: {
    home: "Home",
    progress: "Progress",
    quests: "Quests",
    friends: "Friends",
    profile: "Profile",
  },

  dashboard: {
    petTitle: "Waddles",
    petSubtitle: "Your loyal companion",
    gemsLabel: "Gems",
    energyLabel: "Energy",
    moodLabel: "Mood:",
    moodButtonAria: "Open mood selector",
    dailyTasksTitle: "Daily Tasks",
    addTaskTrigger: "Add Task",
    addTaskDialogTitle: "Add New Task",
    taskNameLabel: "Task Name",
    taskNamePlaceholder: "e.g., Morning run",
    taskRewardLabel: "Gem Reward",
    taskRewardPlaceholder: "10",
    taskCreateBtn: "Create Task",
    todayProgressLabel: "Today's Progress",
    progressPerfect: "Perfect day! 🎉",
    progressAlmost: "Almost there! 💪",
    progressGood: "Good progress! 🚀",
    progressStart: "Finish strong today! ⭐",
  },

  friends: {
    title: "Friends",
    subtitle: "Stay motivated together!",
    inviteBtn: "Invite Friend",
    penguinLabel: "Penguin",
    streakText: "day streak",
    gemsText: "gems",
    travelingTitle: "Traveling Together",
    travelingText:
      "When you and your friends complete tasks, your penguins travel together!",
  },

  profile: {
    editBtn: "Edit Profile",
    customizeTitle: "Customize Your Penguin",
    penguinColorLabel: "Penguin Color",
    penguinNameLabel: "Penguin Name",
    streakCalendarTitle: "Streak Calendar",
    streakLegendPerfect: "Perfect Day",
    streakLegendCompleted: "Completed",
    streakLegendMissed: "Missed",
    gemHistoryTitle: "Gem History",
    gemHistoryEmpty: "No gem activity yet.",
  },

  progress: {
    todayTitle: "Today’s Progress",
    tasksCompleted: "Tasks Completed",
    consistencyScore: "Consistency Score",
    weeklyTitle: "Weekly Progress",
    weeklyTasksLabel: "Tasks This Week",
    consistencyLabel: "Consistency",
    bestDayLabel: "Best Day",
    moodTrackerTitle: "Mood Tracker",
    moodSummaryPositive: "Mostly positive this week! 💙",
    streaksTitle: "Streaks",
    currentStreakLabel: "Current Streak",
    longestStreakLabel: "Longest Streak",
    activeDaysLabel: "Active Days",
    gemsLevelTitle: "Gems & Level",
    dailyGemsLabel: "Daily Gems",
    weeklyGemsLabel: "Weekly Gems",
    levelProgressLabel: "Level Progress",
    gemsUntilNext: (n: number) => `${n} gems until next level!`,
  },

  quests: {
    pageTitle: "Quests",
    pageSubtitle:
      "Complete quests to earn bonus gems and level up your penguin!",
    tabs: {
      daily: "Daily",
      weekly: "Weekly",
      special: "Special",
    },
    difficulty: {
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
    },
  },

  tasks: {
    emptyState: "No tasks yet. Add your first task!",
    rewardPrefix: "+",
    completedLabel: "Completed",
  },

  labels: {
    totalGems: "Total Gems",
    level: "Level",
  },

  format: {
    daySuffix: (n: number) => `${n} day${n === 1 ? "" : "s"}`,
    fraction: (a: number, b: number) => `${a} / ${b}`,
    percent: (p: number) => `${Math.round(p)}%`,
  },
};

// tiny constants: emojis, small arrays used throughout
export const TOKENS = {
  emojis: {
    gem: "💎",
    fire: "🔥",
    energy: "⚡",
  },
  moods: ["😊", "😃", "😌", "😔", "😴", "🤗"],
};