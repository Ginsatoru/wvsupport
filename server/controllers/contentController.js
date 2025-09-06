const HeroContent = require('../models/FrontendContent');
const fs = require('fs');
const path = require('path');

// Helper function to delete old image file
const deleteOldImage = (imagePath) => {
  if (imagePath && fs.existsSync(imagePath)) {
    try {
      fs.unlinkSync(imagePath);
      console.log(`🗑️  Deleted old image: ${imagePath}`);
    } catch (error) {
      console.error(`❌ Error deleting old image: ${error.message}`);
    }
  }
};

// @desc    Get active hero content for frontend
// @route   GET /api/content/hero/active
// @access  Public
const getActiveHeroContent = async (req, res) => {
  try {
    const heroContent = await HeroContent.findOne({ isActive: true })
      .sort({ updatedAt: -1 });

    if (!heroContent) {
      return res.status(404).json({
        success: false,
        message: 'No active hero content found'
      });
    }

    // Construct full image URL
    const fullImageUrl = heroContent.backgroundImage.startsWith('http') 
      ? heroContent.backgroundImage 
      : `${req.protocol}://${req.get('host')}/${heroContent.backgroundImage}`;

    const responseData = {
      ...heroContent.toObject(),
      backgroundImage: fullImageUrl
    };

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Error fetching active hero content:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all hero content for admin
// @route   GET /api/content/hero/admin/all
// @access  Private (Admin)
const getAllHeroContent = async (req, res) => {
  try {
    const heroContents = await HeroContent.find()
      .sort({ updatedAt: -1 });

    // Construct full image URLs
    const responseData = heroContents.map(content => {
      const fullImageUrl = content.backgroundImage.startsWith('http') 
        ? content.backgroundImage 
        : `${req.protocol}://${req.get('host')}/${content.backgroundImage}`;
      
      return {
        ...content.toObject(),
        backgroundImage: fullImageUrl
      };
    });

    res.json({
      success: true,
      data: responseData,
      count: responseData.length
    });
  } catch (error) {
    console.error('Error fetching all hero content:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new hero content
// @route   POST /api/content/hero/admin
// @access  Private (Admin)
const createHeroContent = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      primaryCtaText,
      primaryCtaLink,
      secondaryCtaText,
      secondaryCtaLink,
      isActive
    } = req.body;

    // Validate required fields
    if (!title || !subtitle) {
      return res.status(400).json({
        success: false,
        message: 'Title and subtitle are required'
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Background image is required'
      });
    }

    // If this hero is set as active, deactivate all others
    if (isActive === 'true' || isActive === true) {
      await HeroContent.updateMany({}, { isActive: false });
    }

    const heroData = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      primaryCtaText: primaryCtaText?.trim() || 'Learn More',
      primaryCtaLink: primaryCtaLink?.trim() || '/services',
      secondaryCtaText: secondaryCtaText?.trim() || 'Get Started',
      secondaryCtaLink: secondaryCtaLink?.trim() || '/contact',
      backgroundImage: `uploads/${req.file.filename}`,
      isActive: isActive === 'true' || isActive === true
    };

    const newHeroContent = new HeroContent(heroData);
    await newHeroContent.save();

    // Return response with full image URL
    const fullImageUrl = `${req.protocol}://${req.get('host')}/${heroData.backgroundImage}`;
    const responseData = {
      ...newHeroContent.toObject(),
      backgroundImage: fullImageUrl
    };

    res.status(201).json({
      success: true,
      message: 'Hero content created successfully',
      data: responseData
    });
  } catch (error) {
    // Delete uploaded file if hero creation fails
    if (req.file) {
      deleteOldImage(req.file.path);
    }

    console.error('Error creating hero content:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update hero content
// @route   PUT /api/content/hero/admin/:id
// @access  Private (Admin)
const updateHeroContent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      primaryCtaText,
      primaryCtaLink,
      secondaryCtaText,
      secondaryCtaLink,
      isActive
    } = req.body;

    // Find existing hero content
    const existingHero = await HeroContent.findById(id);
    if (!existingHero) {
      // Clean up uploaded file if hero doesn't exist
      if (req.file) {
        deleteOldImage(req.file.path);
      }
      return res.status(404).json({
        success: false,
        message: 'Hero content not found'
      });
    }

    // Validate required fields
    if (!title || !subtitle) {
      if (req.file) {
        deleteOldImage(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Title and subtitle are required'
      });
    }

    // If this hero is set as active, deactivate all others
    if (isActive === 'true' || isActive === true) {
      await HeroContent.updateMany({ _id: { $ne: id } }, { isActive: false });
    }

    // Prepare update data
    const updateData = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      primaryCtaText: primaryCtaText?.trim() || 'Learn More',
      primaryCtaLink: primaryCtaLink?.trim() || '/services',
      secondaryCtaText: secondaryCtaText?.trim() || 'Get Started',
      secondaryCtaLink: secondaryCtaLink?.trim() || '/contact',
      isActive: isActive === 'true' || isActive === true,
      updatedAt: Date.now()
    };

    // Handle image update
    if (req.file) {
      // Delete old image
      const oldImagePath = path.join(__dirname, '..', existingHero.backgroundImage);
      deleteOldImage(oldImagePath);
      
      // Set new image path
      updateData.backgroundImage = `uploads/${req.file.filename}`;
    }

    // Update hero content
    const updatedHero = await HeroContent.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    // Return response with full image URL
    const fullImageUrl = updatedHero.backgroundImage.startsWith('http') 
      ? updatedHero.backgroundImage 
      : `${req.protocol}://${req.get('host')}/${updatedHero.backgroundImage}`;

    const responseData = {
      ...updatedHero.toObject(),
      backgroundImage: fullImageUrl
    };

    res.json({
      success: true,
      message: 'Hero content updated successfully',
      data: responseData
    });
  } catch (error) {
    // Delete uploaded file if update fails
    if (req.file) {
      deleteOldImage(req.file.path);
    }

    console.error('Error updating hero content:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete hero content
// @route   DELETE /api/content/hero/admin/:id
// @access  Private (Admin)
const deleteHeroContent = async (req, res) => {
  try {
    const { id } = req.params;

    const heroContent = await HeroContent.findById(id);
    if (!heroContent) {
      return res.status(404).json({
        success: false,
        message: 'Hero content not found'
      });
    }

    // Delete associated image file
    const imagePath = path.join(__dirname, '..', heroContent.backgroundImage);
    deleteOldImage(imagePath);

    // Delete from database
    await HeroContent.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Hero content deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hero content:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Toggle hero content active status
// @route   PATCH /api/content/hero/admin/:id/toggle-active
// @access  Private (Admin)
const toggleHeroActive = async (req, res) => {
  try {
    const { id } = req.params;

    const heroContent = await HeroContent.findById(id);
    if (!heroContent) {
      return res.status(404).json({
        success: false,
        message: 'Hero content not found'
      });
    }

    // If making this hero active, deactivate all others
    if (!heroContent.isActive) {
      await HeroContent.updateMany({ _id: { $ne: id } }, { isActive: false });
    }

    // Toggle the active status
    heroContent.isActive = !heroContent.isActive;
    await heroContent.save();

    // Return response with full image URL
    const fullImageUrl = heroContent.backgroundImage.startsWith('http') 
      ? heroContent.backgroundImage 
      : `${req.protocol}://${req.get('host')}/${heroContent.backgroundImage}`;

    const responseData = {
      ...heroContent.toObject(),
      backgroundImage: fullImageUrl
    };

    res.json({
      success: true,
      message: `Hero content ${heroContent.isActive ? 'activated' : 'deactivated'} successfully`,
      data: responseData
    });
  } catch (error) {
    console.error('Error toggling hero active status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getActiveHeroContent,
  getAllHeroContent,
  createHeroContent,
  updateHeroContent,
  deleteHeroContent,
  toggleHeroActive
};