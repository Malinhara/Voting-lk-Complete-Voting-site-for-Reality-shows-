import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { MDBDropdown } from 'mdb-react-ui-kit';
import { SimpleLinearRegression } from 'ml-regression';
import React, { useEffect, useState } from "react";
import { Form } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { auth, firestore } from '../firebase';
import './Styles.css';

export default function Adminhome() {
  const [competitorDetails, setCompetitorDetails] = useState([]);
  const [selectedcomId, setSelectedcomId] = useState('');
  const [selectedcomId1, setSelectedcomId1] = useState('');
  const [newPastData, setNewPastData] = useState([]);
  const [newPastData1, setNewPastData1] = useState([]);
  const [predictedVoteCount, setPredictedVoteCount] = useState(null);
  const [predictedVoteCount1, setPredictedVoteCount1] = useState(null);

  const user = auth.currentUser;

  useEffect(() => {
    const fetchCompetitorDetails = async () => {
      try {
        if (user) {
          const competitorsCollection = collection(firestore, 'competitors');
          const q = query(competitorsCollection, where('Adminid', '==', user.uid));
          const querySnapshot = await getDocs(q);
          const fetchedCompetitorData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setCompetitorDetails(fetchedCompetitorData);
        }
      } catch (error) {
        console.error('Error fetching competitor details:', error.message);
      }
    };
    fetchCompetitorDetails();
  }, [user]);

  const fetchSelectedCompetitorData = async () => {
    try {
      if (user && selectedcomId && selectedcomId1) {
        const competitorsCollection = collection(firestore, 'competitors');
        const competitorDocRef = doc(competitorsCollection, selectedcomId);
        const competitorDocRef1 = doc(competitorsCollection, selectedcomId1);
        const competitorDocSnapshot = await getDoc(competitorDocRef);
        const competitorDocSnapshot1 = await getDoc(competitorDocRef1);
  
        if (competitorDocSnapshot.exists()) {
          const selectedCompetitorData = competitorDocSnapshot.data();
          if (selectedCompetitorData && selectedCompetitorData.votedPool) {
            const votedPoolData = selectedCompetitorData.votedPool;
            const newData = Object.entries(votedPoolData).map(([poolid, voteCount]) => ({ poolid, voteCount }));
  
            // Encode poolid as numbers
            const poolIdMap = {};
            let nextPoolId = 1;
            const newDataEncoded = newData.map(data => {
              if (!(data.poolid in poolIdMap)) {
                poolIdMap[data.poolid] = nextPoolId;
                nextPoolId++;
              }
              return { ...data, poolid: poolIdMap[data.poolid] };
            });
  
            setNewPastData(newDataEncoded);
            console.log(newDataEncoded);
          }
        }
  
        if (competitorDocSnapshot1.exists()) {
          const selectedCompetitorData1 = competitorDocSnapshot1.data();
          if (selectedCompetitorData1 && selectedCompetitorData1.votedPool) {
            const votedPoolData1 = selectedCompetitorData1.votedPool;
            const newData1 = Object.entries(votedPoolData1).map(([poolid, voteCount]) => ({ poolid, voteCount }));
            
            const poolIdMap1 = {};
            let nextPoolId1 = 1;
            const newDataEncoded1 = newData1.map(data => {
              if (!(data.poolid in poolIdMap1)) {
                poolIdMap1[data.poolid] = nextPoolId1;
                nextPoolId1++;
              }
              return { ...data, poolid: poolIdMap1[data.poolid] };
            });
  
            setNewPastData1(newDataEncoded1);
            console.log(newDataEncoded1);
          }
        }
      } else {
        console.warn('Competitor not found with the specified competitorId:', selectedcomId);
      }
    } catch (error) {
      console.error('Error fetching competitor details:', error.message);
    }
  };
  

  useEffect(() => {
    fetchSelectedCompetitorData();
  }, [selectedcomId, selectedcomId1]);


  const trainModel = () => {
    // Extract past pool ids and vote counts
    const X = newPastData.map(d => d.poolid);
    const y = newPastData.map(d => d.voteCount);
    // Train the linear regression model
    const model = new SimpleLinearRegression(X, y);
    return model;
  };

  const predictNextVoteCount = () => {
    // Train the model
    const model = trainModel();
    // Predict vote count for the next poolid
    const nextPoolId = newPastData.length + 1; // Assuming pool IDs are sequential
    const predictedCount = model.predict(nextPoolId);
    setPredictedVoteCount(predictedCount);
  };

  const trainModel1 = () => {
    // Extract past pool ids and vote counts
    const X = newPastData1.map(d => d.poolid);
    const y = newPastData1.map(d => d.voteCount);
    // Train the linear regression model
    const model1 = new SimpleLinearRegression(X, y);
    return model1;
  };

  const predictNextVoteCount1 = () => {
    // Train the model
    const model1 = trainModel1();
    // Predict vote count for the next poolid
    const nextPoolId = newPastData1.length + 1; // Assuming pool IDs are sequential
    const predictedCount = model1.predict(nextPoolId);
    setPredictedVoteCount1(predictedCount);
  };




 
  return (
    <div className="Align" style={{ backgroundColor: '#f3f6fd' }}>
      <Container>
        <Row>
          <Col style={{ marginTop: '20px' }}>
            <div style={{ width: 560, height: 330, position: 'relative', background: 'white', borderRadius: 22, border: '1px rgba(0, 0, 0, 0.10) solid' }}>
              <h5 style={{ marginLeft: '10px', marginTop: '10px' }}>Analysis</h5>
              <div className="d-flex">
                <div className="p-2 flex-fill">
                  <MDBDropdown dropright name="type">
                    <Form.Select onChange={(e) => setSelectedcomId(e.target.value)} aria-label="Default select example">
                      <option>Select Competitor</option>
                      {competitorDetails.map((competitor) => (
                        <option key={competitor.id} value={competitor.id}>
                          {`${competitor.id} - ${competitor.Name}`}
                        </option>
                      ))}
                    </Form.Select>
                  </MDBDropdown>
                </div>
                <div className="p-2 flex-fill"><h4>VS</h4></div>
                <div className="p-2 flex-fill">
                  <MDBDropdown dropright name="type">
                    <Form.Select onChange={(e) => setSelectedcomId1(e.target.value)} aria-label="Default select example">
                      <option>Select Competitor</option>
                      {competitorDetails.map((competitor) => (
                        <option key={competitor.id} value={competitor.id}>
                          {`${competitor.id} - ${competitor.Name}`}
                        </option>
                      ))}
                    </Form.Select>
                  </MDBDropdown>
                </div>
              </div>
              <div className="d-flex">
                <div className="p-2 flex-fill">
                  <img src="https://i.ibb.co/9p2QLq3/download-4.jpg" className="img-fluid rounded" alt="Competitor 1" width={'100px'} height={"50px"} />
                </div>
                <div className="p-2 flex-fill" style={{ marginLeft: "110px" }}>
                  <img src="https://i.ibb.co/9p2QLq3/download-4.jpg" className="img-fluid rounded" alt="Competitor 2" width={'100px'} height={"50px"} />
                </div>
              </div>
              <div>
    
        <button onClick={ predictNextVoteCount}>Add Past Data</button>
      </div>
      <div>
        <p>Predicted vote count for the next pool: {predictedVoteCount}</p>
        
      </div>

      <div>
    
    <button onClick={ predictNextVoteCount1}>Add Past Data</button>
  </div>
  <div>
    <p>Predicted vote count for the next pool: {predictedVoteCount1}</p>
    
  </div>

            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
