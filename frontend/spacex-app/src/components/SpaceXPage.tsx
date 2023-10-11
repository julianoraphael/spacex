import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket } from '@fortawesome/free-solid-svg-icons';
import { PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import 'bootstrap/dist/css/bootstrap.css';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import debounce from 'lodash.debounce';

interface PieChartDataItem {
  name: string;
  value: number;
}

interface BarChartDataItem {
  name: string;
  rocketData: { [rocketName: string]: number };
}

interface MissionDataItem {
  _id: string;
  name: string;
  date_utc: string;
  success: boolean;
  flight_number: number;
  links: {
    patch: {
      small: string;
    };
    webcast: string;
  };
  rocket: string;
}



const SpaceXPage: React.FC = () => {
  const [pieChartData, setPieChartData] = useState<PieChartDataItem[]>([]);
  const [barChartData, setBarChartData] = useState<BarChartDataItem[]>([]);
  const [pieChartColors, setPieChartColors] = useState<string[]>([]);
  const [launchData, setLaunchData] = useState<any>({});
  const [missionsData, setMissionsData] = useState<MissionDataItem[]>([]);
  const [pageInfo, setPageInfo] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const customColors = ['#459ae5', '#000000', '#f57c00', '#d9d9d9'];
    setPieChartColors(customColors);

    fetch('http://localhost:3000/launches/stats')
      .then((response) => response.json())
      .then((data) => {
        setLaunchData(data);

        const rocketCountReusedData = data.rocketCountReused.map(
          (item: { _id: any; count: any; name: any }) => ({
            name: `${item.name} Usado`,
            value: item.count,
          })
        );

        const rocketUsageData = data.rocketUsage.map(
          (item: { _id: any; count: any; name: any }) => ({
            name: `${item.name} `,
            value: item.count,
          })
        );

        const combinedPieChartData = [
          ...rocketCountReusedData,
          ...rocketUsageData,
        ].sort((a, b) => b.value - a.value);
        setPieChartData(combinedPieChartData);

        const launchesByYearData = data.rocketUsageByYear.reduce(
          (acc: { [x: string]: { [x: string]: any } }, item: { year: { toString: () => any }; rocketName: any; count: any }) => {
            const year = item.year.toString();
            const rocketName = item.rocketName;
            const count = item.count;

            if (!acc[year]) {
              acc[year] = {};
            }

            if (!acc[year][rocketName]) {
              acc[year][rocketName] = 0;
            }

            acc[year][rocketName] += count;

            return acc;
          },
          {}
        );

        const transformedData = Object.keys(launchesByYearData).map(
          (year) => ({
            name: year,
            rocketData: launchesByYearData[year],
          })
        );

        setBarChartData(transformedData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    loadMissionsData(1);
  }, []);

  useEffect(() => {
    loadMissionsData(1);
  }, [searchTerm]);

  const loadMissionsData = (page: number) => {
    fetch(`http://localhost:3000/launches?limit=5&page=${page}&search=${searchTerm}`)
      .then((response) => response.json())
      .then(async (missions) => {
        const missionsWithRocketNames = await Promise.all(
          missions.results.map(async (mission: { rocket: any }) => {
            try {
              const rocketResponse = await fetch(
                `http://localhost:3000/rockets/${mission.rocket}`
              );
              const rocketData = await rocketResponse.json();

              return {
                ...mission,
                rocket: rocketData.name,
              };
            } catch (error) {
              console.error('Error fetching rocket data:', error);
              return mission;
            }
          })
        );

        setMissionsData(missionsWithRocketNames);

        setPageInfo({
          totalDocs: missions.totalDocs,
          page: missions.page,
          totalPages: missions.totalPages,
          hasNext: missions.hasNext,
          hasPrev: missions.hasPrev,
        });
      })
      .catch((error) => {
        console.error('Error fetching missions data:', error);
      });
  };

  const handleNextPage = () => {
    if (pageInfo.hasNext) {
      loadMissionsData(pageInfo.page + 1);
    }
  };

  const handlePrevPage = () => {
    if (pageInfo.hasPrev) {
      loadMissionsData(pageInfo.page - 1);
    }
  };

  const handleFirstPage = () => {
    loadMissionsData(1);
  };

  const handleLastPage = () => {
    loadMissionsData(pageInfo.totalPages);
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber !== pageInfo.page) {
      loadMissionsData(pageNumber);
    }
  };

  // Função de pesquisa com debounce
  const searchWithDebounce = debounce((term: string) => {
    // Chame a função de pesquisa com debounce
    loadMissionsData(1); // Recarregue a lista de missões com o novo termo de pesquisa
  }, 300); // Aguarde 300ms após a última digitação

  const pageStyle = {
    backgroundColor: '#343a40',
    color: '#ffffff',
    padding: '20px',
    margin: '0',
    width: '100%',
  };

  const titleStyle = {
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    maxWidth: '400px',
    margin: '0 auto',
    marginBottom: '20px',
  };

  const rocketIconStyle = {
    color: '#a94c09',
    marginRight: '10px',
  };

  const pieChartContainerStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const pieChartStyle = {
    flex: 1,
  };

  const pieChartTextContainerStyle = {
    marginLeft: '20px',
  };

  const pageNumbers = [];
  for (let i = pageInfo.page - 2; i <= pageInfo.page + 2; i++) {
    if (i > 0 && i <= pageInfo.totalPages) {
      pageNumbers.push(i);
    }
  }

  return (
    <div style={pageStyle}>
      <div className='center-content'>
        <h1 style={titleStyle}>
          <FontAwesomeIcon icon={faRocket} style={rocketIconStyle} /> SpaceX
        </h1>
        <div
          className='d-flex '
          style={{ background: '#343a40', padding: '20px', margin: '20px' }}
        >
          <div
            className='col-md-6'
            style={{
              background: '#6c757d',
              padding: '20px',
            }}
          >
            <h3 style={{ color: 'black', textAlign: 'center' }}>
              Lançamento de foguetes
            </h3>
            <div style={pieChartContainerStyle}>
              <div style={{
                textAlign: 'center',
                marginBottom: '20px',
              }}>
                <h2 style={{ color: 'black' }}>Resultado de Lançamentos:</h2>
                <h3 style={{ color: '#00ff19', marginBottom: '5px' }}>
                  Sucesso: {launchData.successFailure?.successes || 0}
                </h3>
                <h3 style={{ color: 'red', marginBottom: '5px' }}>
                  Falha: {launchData.successFailure?.failures || 0}
                </h3>
              </div>

              <style>
                {`
    @media (max-width: 768px) {
      div {
        display: block;
      }
    }
  `}
              </style>
              <div style={pieChartStyle}>
                <PieChart width={400} height={400}>
                  <Pie
                    dataKey='value'
                    isAnimationActive={false}
                    data={pieChartData}
                    cx={200}
                    cy={150}
                    outerRadius={100}
                    fill='#8884d8'
                    label={{
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}
                    key='pie-chart'
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={pieChartColors[index % pieChartColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    formatter={(value, entry) => (
                      <span
                        style={{
                          fontSize: '18px',
                          fontWeight: 'bold',
                          margin: '10px 0',
                          marginRight: '40px'
                        }}
                      >
                        {value}
                      </span>
                    )}
                    iconSize={0}
                    align='center'
                    layout='horizontal'
                  />
                </PieChart>
              </div>
            </div>
          </div>

          <div
            className='col-md-6'
            style={{
              background: '#6c757d',
              padding: '20px',
              marginLeft: '20px',
              textAlign: 'center',
            }}
          >
            <h3 style={{ color: 'black' }}>Lançamentos por ano</h3>
            <BarChart width={500} height={400} data={barChartData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' tick={{ fill: 'white', fontSize: 10 }} interval={0} />
              <YAxis tick={{ fill: 'white' }} />
              <Tooltip />
              <Legend
                formatter={(value, entry) => (
                  <span
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      margin: '10px 0',
                    }}
                  >
                    {value}
                  </span>
                )}
                iconSize={0}
                align='center'
                layout='horizontal'
              />
              {Array.from(new Set(barChartData.flatMap((item) => Object.keys(item.rocketData)))).map((rocketName, index) => (
                <Bar
                  key={`bar-${index}`}
                  dataKey={`rocketData.${rocketName}`}
                  fill={pieChartColors[index % pieChartColors.length]}
                  stackId='a'
                  name={rocketName}
                />
              ))}
            </BarChart>
          </div>
        </div>

        <div className='row' style={{ width: '90%', margin: '0 auto' }}>
          <div className='col-md-12'>
            <h3 style={{ textAlign: 'center' }}>Registros de lançamentos</h3>
            <br />
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                searchWithDebounce(e.target.value);
              }}
              placeholder='Pesquisar missões'
            />
            <div className='col-md-12'>
              <div style={{ background: '#6c757d', padding: '10px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: 'black',
                    padding: '5px 10px',
                    fontWeight: 'bold',
                    borderBottom: '2px solid #343a40',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ flex: 0.5 }}>Nº Vôo</div>
                  <div style={{ flex: 1 }}>Logo</div>
                  <div style={{ flex: 2 }}>Missão</div>
                  <div style={{ flex: 1.5 }}>Data de Lançamento</div>
                  <div style={{ flex: 1 }}>Foguete</div>
                  <div style={{ flex: 1 }}>Resultado</div>
                  <div style={{ flex: 1 }}>Vídeo</div>
                </div>

                {missionsData
  .filter((mission) =>
    mission.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .map((mission, index) => (
    <div
      key={mission._id}
      className={`mission-row ${index % 2 === 0 ? 'even-row' : 'odd-row'}`}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'black',
        padding: '5px 10px',
        borderBottom: '1px solid #343a40',
        backgroundColor: 'white',
        textAlign: 'center',
        borderRadius: '10px',
        margin: '10px',
      }}
    >
      <div style={{ flex: 0.5 }}>{mission.flight_number}</div>
      <div style={{ flex: 1 }}>
        <img
          src={mission.links.patch.small}
          alt=''
          style={{ width: '30px', height: '30px' }}
        />
      </div>
      <div style={{ flex: 2, fontWeight: 'bold' }}>{mission.name}</div>
      <div style={{ flex: 1.5 }}>{mission.date_utc}</div>
      <div style={{ flex: 1, fontWeight: 'bold' }}>{mission.rocket}</div>
      <div style={{ flex: 1 }}>
        {mission.success === null ? (
          <span
            style={{
              color: 'black',
              backgroundColor: '#dab501',
              padding: '5px 10px',
              borderRadius: '6px',
              fontWeight: 'bold',
            }}
          >
            N. EXECUTADA
          </span>
        ) : (
          <span
            style={{
              color: 'white',
              backgroundColor: mission.success ? 'green' : '#961314',
              padding: '5px 10px',
              borderRadius: '6px',
              fontWeight: 'bold',
            }}
          >
            {mission.success ? 'SUCESSO' : ' FALHA '}
          </span>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <a
          href={mission.links.webcast}
          target='_blank'
          rel='noopener noreferrer'
        >
          <FontAwesomeIcon icon={faYoutube} style={{ color: 'red', fontSize: 35 }} />
        </a>
      </div>
    </div>
  ))}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: 'black',
                padding: '5px 10px',
                fontWeight: 'bold',
                borderBottom: '2px solid #343a40',
                textAlign: 'center',
              }}
            >
              <div>
                <button onClick={handleFirstPage} disabled={pageInfo.page === 1}>
                  {'<<'}
                </button>
                <button onClick={handlePrevPage} disabled={!pageInfo.hasPrev}>
                  Anterior
                </button>
              </div>
              <div>
                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    disabled={pageNumber === pageInfo.page}
                    style={{
                      backgroundColor: pageNumber === pageInfo.page ? '#343a40' : '#6c757d',
                      color: pageNumber === pageInfo.page ? '#ffffff' : 'black',
                      cursor: pageNumber === pageInfo.page ? 'not-allowed' : 'pointer',
                      margin: '0 5px',
                    }}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
              <div>
                <button onClick={handleNextPage} disabled={!pageInfo.hasNext}>
                  Próxima
                </button>
                <button onClick={handleLastPage} disabled={pageInfo.page === pageInfo.totalPages}>
                  {'>>'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceXPage;
