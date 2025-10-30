// Sponsor Store API for TomoTrip
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

class SponsorStoreAPIService {
  constructor() {
    this.storesFilePath = path.join(__dirname, '../data/sponsor-stores.json');
    this.ensureDataDirectory();
  }

  // Ensure data directory exists
  ensureDataDirectory() {
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(this.storesFilePath)) {
      fs.writeFileSync(this.storesFilePath, JSON.stringify([], null, 2));
    }
  }

  // Load stores from file
  loadStores() {
    try {
      const data = fs.readFileSync(this.storesFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading stores:', error);
      return [];
    }
  }

  // Save stores to file
  saveStores(stores) {
    try {
      fs.writeFileSync(this.storesFilePath, JSON.stringify(stores, null, 2));
    } catch (error) {
      console.error('Error saving stores:', error);
    }
  }

  // Get store by email
  getStoreByEmail(email) {
    const stores = this.loadStores();
    return stores.find(store => store.email === email);
  }

  // Get store by ID
  getStoreById(id) {
    const stores = this.loadStores();
    return stores.find(store => store.id === id);
  }

  // Create new store
  createStore(storeData) {
    const stores = this.loadStores();
    
    const newStore = {
      id: randomUUID(),
      storeName: storeData.storeName,
      email: storeData.email,
      phone: storeData.phone,
      address: storeData.address || '',
      description: storeData.description || '',
      category: storeData.category || 'other',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    stores.push(newStore);
    this.saveStores(stores);
    return newStore;
  }

  // Update store
  updateStore(id, updates) {
    const stores = this.loadStores();
    const index = stores.findIndex(s => s.id === id);
    
    if (index === -1) {
      return null;
    }

    stores[index] = {
      ...stores[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.saveStores(stores);
    return stores[index];
  }

  // Get all active stores
  getAllStores() {
    const stores = this.loadStores();
    return stores.filter(store => store.isActive);
  }

  // Delete store (soft delete)
  deleteStore(id) {
    const stores = this.loadStores();
    const index = stores.findIndex(s => s.id === id);
    
    if (index === -1) {
      return null;
    }

    // Soft delete by setting isActive to false
    stores[index].isActive = false;
    stores[index].deletedAt = new Date().toISOString();
    
    this.saveStores(stores);
    return stores[index];
  }

  // Hard delete store (permanently remove from file)
  hardDeleteStore(id) {
    const stores = this.loadStores();
    const filteredStores = stores.filter(s => s.id !== id);
    
    if (stores.length === filteredStores.length) {
      return null; // Store not found
    }
    
    this.saveStores(filteredStores);
    return true;
  }

  // Setup Express routes
  setupRoutes(app) {
    // Create sponsor store
    app.post('/api/sponsor-stores', async (req, res) => {
      try {
        const storeData = req.body;
        console.log('📝 Creating sponsor store:', storeData.storeName);
        
        // Check if store already exists
        const existingStore = this.getStoreByEmail(storeData.email);
        if (existingStore) {
          return res.status(409).json({ error: 'Store with this email already exists' });
        }
        
        // Create new store
        const newStore = this.createStore(storeData);
        console.log('✅ Store created with ID:', newStore.id);
        
        res.status(201).json(newStore);
      } catch (error) {
        console.error('❌ Error creating sponsor store:', error);
        res.status(500).json({ error: 'Failed to create store' });
      }
    });
    
    // Get store by ID
    app.get('/api/sponsor-stores/:id', async (req, res) => {
      try {
        const store = this.getStoreById(req.params.id);
        if (!store) {
          return res.status(404).json({ error: 'Store not found' });
        }
        res.json(store);
      } catch (error) {
        console.error('❌ Error fetching store:', error);
        res.status(500).json({ error: 'Failed to fetch store' });
      }
    });
    
    // Update store
    app.put('/api/sponsor-stores/:id', async (req, res) => {
      try {
        const updatedStore = this.updateStore(req.params.id, req.body);
        if (!updatedStore) {
          return res.status(404).json({ error: 'Store not found' });
        }
        console.log('✅ Store updated:', updatedStore.id);
        res.json(updatedStore);
      } catch (error) {
        console.error('❌ Error updating store:', error);
        res.status(500).json({ error: 'Failed to update store' });
      }
    });
    
    // Get all stores
    app.get('/api/sponsor-stores', async (req, res) => {
      try {
        const stores = this.getAllStores();
        console.log(`📋 Returning ${stores.length} active stores`);
        res.json(stores);
      } catch (error) {
        console.error('❌ Error fetching stores:', error);
        res.status(500).json({ error: 'Failed to fetch stores' });
      }
    });
    
    // Delete store
    app.delete('/api/sponsor-stores/:id', async (req, res) => {
      try {
        const deleted = this.deleteStore(req.params.id);
        if (!deleted) {
          return res.status(404).json({ error: 'Store not found' });
        }
        console.log('✅ Store deleted:', req.params.id);
        res.json({ message: 'Store deleted successfully', id: req.params.id });
      } catch (error) {
        console.error('❌ Error deleting store:', error);
        res.status(500).json({ error: 'Failed to delete store' });
      }
    });

    console.log('✅ Sponsor Store API routes initialized');
  }
}

// Create singleton instance
const sponsorStoreAPIService = new SponsorStoreAPIService();

module.exports = { sponsorStoreAPIService };
