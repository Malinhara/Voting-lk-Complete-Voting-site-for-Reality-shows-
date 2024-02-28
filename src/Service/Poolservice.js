import axios from "axios";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase"; // Import firestore from your Firebase configuration file

class PoolService {
  static async getAdminData(userId) {
    try {
      const response = await axios.get(`https://firestore.googleapis.com/v1/projects/voting-app-9cc9e/databases/(default)/documents/Admins/${userId}`);
      const adminData = response.data; // Assuming response.data contains the document data
      console.log('Admin data:', adminData); // Log the entire admin data object
      return adminData;
    } catch (error) {
      throw new Error('Error getting admin data: ' + error.message);
    }
  }

 

  static async addPool(pool) {
    try {
      // Ensure emails is initialized as an empty array if it's undefined
      const formattedEmails = Array.isArray(pool.emails) ? pool.emails.map(email => email.trim()) : [];
      const stdateTimestamp = pool.stdate.toISOString();
      const enddateTimestamp = pool.enddate.toISOString();
      const requestBody = {
        fields: {
          title: { stringValue: pool.title },
          description: { stringValue: pool.description },
          stdate: { timestampValue: stdateTimestamp },
          enddate: { timestampValue: enddateTimestamp },
          type: { stringValue: pool.type },
          sponsorImage1: { stringValue: pool.sponsorImage1 ? pool.sponsorImage1 : '' },
          sponsorImage2: { stringValue: pool.sponsorImage2 ? pool.sponsorImage2 : '' },
          emails: { arrayValue: { values: formattedEmails.map(email => ({ stringValue: email })) } },
          Adminid: { stringValue: pool.Adminid },
          Competition_cat: { stringValue: pool. Competition_cat ? pool. Competition_cat : '' },
          Competition_name: { stringValue: pool.Competition_name ? pool.Competition_name: '' },
          Competition_logo: { stringValue: pool. Competition_logo ? pool. Competition_logo : '' }
          // Add other fields similarly
        }
      };
      
      const response = await axios.post(
        'https://firestore.googleapis.com/v1/projects/voting-app-9cc9e/databases/(default)/documents/Pools',
        requestBody
      );
      
      return response.data;
    } catch (error) {
      throw new Error('Error adding pool: ' + error.message);
    }
  }


  static async deletePool(poolId) {
    try {
      const response = await axios.delete(`https://firestore.googleapis.com/v1/projects/voting-app-9cc9e/databases/(default)/documents/Pools/${poolId}`);
      const poolData = response.data;
      return poolData;
    } catch (error) {
      throw new Error('Error deleting pool from Firestore: ' + error.message);
    }
  }




  static async getPooldata(userId) {
    try {
      // Make a GET request to Firestore API to fetch all pools data
      const response = await axios.get(`https://firestore.googleapis.com/v1/projects/voting-app-9cc9e/databases/(default)/documents/Pools`);

      // Extract and filter pools data from the response
      const poolsData = response.data;
      const filteredPoolsData = poolsData.documents.filter(doc => {
        const adminId = doc.fields && doc.fields.Adminid && doc.fields.Adminid.stringValue;
        return adminId === userId;
      });
  
     
      return filteredPoolsData;
    } catch (error) {
      throw new Error('Error getting pools data: ' + error.message);
    }
  }




  static async updatePool(pool, id) {
    try {
      const updatedPoolData = pool.toPlainObject();
      // Ensure competitionLogo is defined before updating Firestore
      if (updatedPoolData.competitionLogo === undefined) {
        updatedPoolData.competitionLogo = ''; // Provide a default value if it's undefined
      }
      const poolRef = doc(firestore, 'Pools', id);
      await updateDoc(poolRef, updatedPoolData);
    } catch (error) {
      throw new Error('Error updating pool in Firestore: ' + error.message);
    }
  }

}

export default PoolService;
