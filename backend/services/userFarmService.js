const { UserFarmDetails, User, SupportedCrop } = require('../models');
const { Op } = require('sequelize');

class UserFarmService {
  
  // Create a new farm for a user
  async createFarm(userId, farmData) {
    try {
      const {
        farmName,
        state,
        district,
        village,
        pincode,
        latitude,
        longitude,
        totalFarmSize,
        farmSizeUnit = 'hectares',
        soilType,
        irrigationType,
        waterSource,
        mainCrops = [],
        secondaryCrops = [],
        farmingType,
        hasStorageFacility = false,
        hasProcessingFacility = false,
        equipmentOwned = [],
        isPrimaryFarm = false
      } = farmData;

      // If this is set as primary farm, unset other primary farms for this user
      if (isPrimaryFarm) {
        await UserFarmDetails.update(
          { isPrimaryFarm: false },
          { where: { userId, isActive: true } }
        );
      }

      const farm = await UserFarmDetails.create({
        userId,
        farmName,
        state,
        district,
        village,
        pincode,
        latitude,
        longitude,
        totalFarmSize,
        farmSizeUnit,
        soilType,
        irrigationType,
        waterSource,
        mainCrops,
        secondaryCrops,
        farmingType,
        hasStorageFacility,
        hasProcessingFacility,
        equipmentOwned,
        isPrimaryFarm
      });

      return farm;
    } catch (error) {
      throw new Error(`Failed to create farm: ${error.message}`);
    }
  }

  // Get all farms for a user
  async getUserFarms(userId) {
    try {
      const farms = await UserFarmDetails.findAll({
        where: { userId, isActive: true },
        order: [['isPrimaryFarm', 'DESC'], ['createdAt', 'ASC']]
      });

      return farms;
    } catch (error) {
      throw new Error(`Failed to get user farms: ${error.message}`);
    }
  }

  // Get a specific farm by ID
  async getFarmById(farmId, userId) {
    try {
      const farm = await UserFarmDetails.findOne({
        where: { id: farmId, userId, isActive: true }
      });

      if (!farm) {
        throw new Error('Farm not found');
      }

      return farm;
    } catch (error) {
      throw new Error(`Failed to get farm: ${error.message}`);
    }
  }

  // Update farm details
  async updateFarm(farmId, userId, updateData) {
    try {
      const farm = await UserFarmDetails.findOne({
        where: { id: farmId, userId, isActive: true }
      });

      if (!farm) {
        throw new Error('Farm not found');
      }

      // If setting as primary farm, unset other primary farms
      if (updateData.isPrimaryFarm === true) {
        await UserFarmDetails.update(
          { isPrimaryFarm: false },
          { where: { userId, isActive: true, id: { [Op.ne]: farmId } } }
        );
      }

      await farm.update(updateData);
      return farm;
    } catch (error) {
      throw new Error(`Failed to update farm: ${error.message}`);
    }
  }

  // Delete (deactivate) a farm
  async deleteFarm(farmId, userId) {
    try {
      const farm = await UserFarmDetails.findOne({
        where: { id: farmId, userId, isActive: true }
      });

      if (!farm) {
        throw new Error('Farm not found');
      }

      await farm.update({ isActive: false });
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete farm: ${error.message}`);
    }
  }

  // Get primary farm for user
  async getPrimaryFarm(userId) {
    try {
      const primaryFarm = await UserFarmDetails.findOne({
        where: { userId, isPrimaryFarm: true, isActive: true }
      });

      // If no primary farm, get the first farm
      if (!primaryFarm) {
        const firstFarm = await UserFarmDetails.findOne({
          where: { userId, isActive: true },
          order: [['createdAt', 'ASC']]
        });

        // Set it as primary if found
        if (firstFarm) {
          await firstFarm.update({ isPrimaryFarm: true });
          return firstFarm;
        }
      }

      return primaryFarm;
    } catch (error) {
      throw new Error(`Failed to get primary farm: ${error.message}`);
    }
  }

  // Get farm statistics
  async getFarmStatistics(userId) {
    try {
      const farms = await UserFarmDetails.findAll({
        where: { userId, isActive: true }
      });

      const totalFarms = farms.length;
      const totalArea = farms.reduce((sum, farm) => sum + parseFloat(farm.totalFarmSize || 0), 0);
      
      const cropDistribution = {};
      farms.forEach(farm => {
        if (farm.mainCrops) {
          farm.mainCrops.forEach(crop => {
            cropDistribution[crop] = (cropDistribution[crop] || 0) + 1;
          });
        }
      });

      const farmingTypes = {};
      farms.forEach(farm => {
        if (farm.farmingType) {
          farmingTypes[farm.farmingType] = (farmingTypes[farm.farmingType] || 0) + 1;
        }
      });

      return {
        totalFarms,
        totalArea,
        averageArea: totalFarms > 0 ? totalArea / totalFarms : 0,
        cropDistribution,
        farmingTypes,
        states: [...new Set(farms.map(f => f.state))],
        districts: [...new Set(farms.map(f => f.district))]
      };
    } catch (error) {
      throw new Error(`Failed to get farm statistics: ${error.message}`);
    }
  }

  // Get suitable crops for a farm based on location and conditions
  async getSuitableCrops(farmId, userId) {
    try {
      const farm = await this.getFarmById(farmId, userId);
      
      const crops = await SupportedCrop.findAll({
        where: { isActive: true }
      });

      // Basic filtering based on farm conditions
      // This is a simplified version - you could enhance with weather, soil data, etc.
      const suitableCrops = crops.filter(crop => {
        // You could add more sophisticated matching logic here
        return true; // For now, return all crops
      });

      return suitableCrops.map(crop => ({
        id: crop.id,
        name: crop.name,
        scientificName: crop.scientificName,
        category: crop.category,
        description: crop.description,
        difficultyLevel: crop.difficultyLevel,
        growingPeriodDays: crop.growingPeriodDays,
        expectedYield: crop.expectedYieldPerHectare,
        waterRequirement: crop.waterRequirementPerWeek
      }));
    } catch (error) {
      throw new Error(`Failed to get suitable crops: ${error.message}`);
    }
  }
}

module.exports = new UserFarmService();
