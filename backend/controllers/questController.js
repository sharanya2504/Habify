const QuestTemplate = require('../models/QuestTemplate');
const UserQuest = require('../models/UserQuest');
const User = require('../models/User');

exports.assignDailyQuests = async (req, res) => {
    const { userId } = req.body;
    const today = new Date();
    today.setHours(0,0,0,0);

    try {
        console.log(`🔄 Assigning quests for user ${userId} on ${today}`);

        // Check if quests already assigned
        let existing = await UserQuest.find({ userId, assignedDate: today });
        if (existing && existing.length > 0) {
            console.log('✅ Quests already assigned today');
            existing = await UserQuest.find({ userId, assignedDate: today }).populate('questId');
            return res.json({ message: 'Quests already assigned today', quests: existing });
        }

        // Fetch templates
        const dailyTemplates = await QuestTemplate.find({ type: 'daily' });
        const weeklyTemplates = await QuestTemplate.find({ type: 'weekly' });
        const specialTemplates = await QuestTemplate.find({ type: 'special' });

        console.log(`📋 Found templates - Daily: ${dailyTemplates.length}, Weekly: ${weeklyTemplates.length}, Special: ${specialTemplates.length}`);

        const shuffledWeekly = weeklyTemplates.sort(() => 0.5 - Math.random()).slice(0,4);
        const shuffledSpecial = specialTemplates.sort(() => 0.5 - Math.random()).slice(0,2);

        const allTemplates = [...dailyTemplates, ...shuffledWeekly, ...shuffledSpecial];
        console.log(`🎯 Total templates to assign: ${allTemplates.length}`);

        const userQuests = [];

        for (let q of allTemplates) {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            const yesterdayQuest = await UserQuest.findOne({
                userId,
                questId: q._id,
                assignedDate: yesterday
            });

            let currentStreak = 0;
            let rewarded = false;

            if (yesterdayQuest && yesterdayQuest.completed) {
                currentStreak = yesterdayQuest.currentStreak + 1;
                console.log(`📈 Continuing streak for ${q.name}: ${currentStreak}`);
            }

            // Check if streak goal is reached - but DON'T award diamonds here
            if (currentStreak >= q.goalStreak) {
                rewarded = true;
                console.log(`🏆 Quest ${q.name} already at goal streak, marked as rewarded`);
            }

            userQuests.push({
                userId,
                questId: q._id,
                type: q.type,
                assignedDate: today,
                completed: false,
                currentStreak: currentStreak,
                goalStreak: q.goalStreak,
                diamonds: q.diamonds,
                rewarded
            });
        }

        const insertedQuests = await UserQuest.insertMany(userQuests);
        console.log(`✅ Inserted ${insertedQuests.length} quests`);

        // populate quest details for frontend
        const populatedQuests = await UserQuest.find({ userId, assignedDate: today }).populate('questId');

        res.json({ 
            message: 'Quests assigned for today with streaks updated', 
            quests: populatedQuests 
        });

    } catch (err) {
        console.error('❌ Error assigning quests:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.getTodaysQuests = async (req, res) => {
    const { userId } = req.params;
    const today = new Date();
    today.setHours(0,0,0,0);

    try {
        const quests = await UserQuest.find({ userId, assignedDate: today })
            .populate('questId');
        res.json({ success: true, quests });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.completeQuest = async (req, res) => {
  const { userQuestId } = req.params;
  const { completed } = req.body;

  try {
    console.log(`🔄 Completing quest ${userQuestId}, completed: ${completed}`);

    const userQuest = await UserQuest.findById(userQuestId).populate('questId');
    if (!userQuest) {
      return res.status(404).json({ error: 'Quest not found' });
    }

    // Store old state for comparison
    const wasCompleted = userQuest.completed;
    const oldStreak = userQuest.currentStreak;

    // Update completion status
    userQuest.completed = completed;

    let diamondsAwarded = 0;
    let updatedUser = null;

    // If marking as COMPLETED (and it wasn't already completed)
    if (completed && !wasCompleted) {
      userQuest.currentStreak += 1;
      console.log(`📈 Streak increased to: ${userQuest.currentStreak}`);
      
      // Check if streak goal is reached and reward not already given
      if (userQuest.currentStreak >= userQuest.goalStreak && !userQuest.rewarded) {
        userQuest.rewarded = true;
        diamondsAwarded = userQuest.diamonds;
        
        console.log(`🎯 Goal reached! Awarding ${diamondsAwarded} diamonds to user ${userQuest.userId}`);
        
        // Add diamonds to user - FIXED: Use findByIdAndUpdate with proper syntax
        updatedUser = await User.findByIdAndUpdate(
          userQuest.userId, 
          { 
            $inc: { 
              totalDiamonds: diamondsAwarded 
            } 
          },
          { new: true } // This returns the updated document
        );
        
        if (updatedUser) {
          console.log(`💎 User ${userQuest.userId} diamonds updated to: ${updatedUser.totalDiamonds}`);
        } else {
          console.log('❌ User not found after update');
        }
      } else {
        // Get current user data even if no diamonds awarded
        updatedUser = await User.findById(userQuest.userId);
      }
    } 
    // If marking as UNCOMPLETED (and it was completed)
    else if (!completed && wasCompleted) {
      userQuest.currentStreak = Math.max(0, userQuest.currentStreak - 1);
      console.log(`📉 Streak decreased to: ${userQuest.currentStreak}`);
      
      // If we had rewarded for this quest and now un-completing, remove reward
      if (userQuest.rewarded && oldStreak >= userQuest.goalStreak) {
        userQuest.rewarded = false;
        diamondsAwarded = -userQuest.diamonds;
        
        console.log(`🔄 Removing ${Math.abs(diamondsAwarded)} diamonds from user ${userQuest.userId}`);
        
        // Remove diamonds from user
        updatedUser = await User.findByIdAndUpdate(
          userQuest.userId, 
          { 
            $inc: { 
              totalDiamonds: diamondsAwarded 
            } 
          },
          { new: true }
        );
        
        if (updatedUser) {
          console.log(`💎 User ${userQuest.userId} diamonds updated to: ${updatedUser.totalDiamonds}`);
        } else {
          console.log('❌ User not found after update');
        }
      } else {
        // Get current user data even if no diamonds changed
        updatedUser = await User.findById(userQuest.userId);
      }
    } else {
      // No change in completion status, just get current user
      updatedUser = await User.findById(userQuest.userId);
    }

    await userQuest.save();
    console.log(`✅ Quest saved: completed=${userQuest.completed}, streak=${userQuest.currentStreak}, rewarded=${userQuest.rewarded}`);

    // Populate the quest details for response
    const updatedQuest = await UserQuest.findById(userQuestId).populate('questId');

    // Ensure we have user data
    if (!updatedUser) {
      updatedUser = await User.findById(userQuest.userId);
    }

    // Verify the user has the expected diamond count
    const finalUserCheck = await User.findById(userQuest.userId);
    console.log(`🔍 Final diamond check: ${finalUserCheck.totalDiamonds}`);

    res.json({
      success: true,
      updatedQuest,
      user: {
        _id: finalUserCheck._id,
        totalDiamonds: finalUserCheck.totalDiamonds,
        totalGems: finalUserCheck.totalDiamonds // Sync gems with diamonds
      },
      diamondsAwarded
    });

  } catch (err) {
    console.error('❌ Error completing quest:', err);
    res.status(500).json({ error: err.message });
  }
};