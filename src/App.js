import React, { useState, useEffect, useMemo } from 'react';
//匯入自建方法、元件(副檔名為js時不需強調)
import { getMoment, findLocation } from './utils/helpers';
import WeatherCard from './views/WeatherCard';
import WeatherSetting from './views/WeatherSetting';
import useWeatherAPI from './hooks/useWeatherAPI';
//匯入樣式套件或圖案
import styled from '@emotion/styled';
//解決通用性主題系列的套件
import { ThemeProvider } from '@emotion/react';

//亮、深色主題
const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow: '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

//定義帶有styled的元件
const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;


//中央氣象局的資料授權金鑰
const AUTHORIZATION_KEY = 'CWB-DA13CCE7-7A2F-4509-A22F-532E3D498736';
//const LOCATION_NAME = '臺北';
//const LOCATION_NAME_FORECAST = '臺北市';

function App() {
  console.log("invoke function component (App.js)");
  //從localStorage取出先前儲存的地區資訊
  const storageCity = localStorage.getItem('cityName') || '臺北市';
  //加入useState來設定資料狀態
  const [currentTheme, setCurrentTheme] = useState('light'); //主題是深色或淺色(預設)
  const [currentPage, setCurrentPage] = useState('WeatherCard'); //主畫面或設定畫面(預設)
  const [currentCity, setCurrentCity] = useState(storageCity);
  //把currentPage包裝成handleCurrentPageChange,透過props傳入子元件裡
  const handleCurrentPageChange = (currentPage) => {
    setCurrentPage(currentPage);
  };
  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity);
  };

  //使用useMemo來根據dependencies內容決定是否重新抓取資料
  const currentLocation = useMemo(() => findLocation(currentCity), [currentCity]);
  const { cityName, locationName, sunriseCityName } = currentLocation;
  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);

  //使用useWeatherAPI
  const [weatherElement, fetchData] = useWeatherAPI({
    authorizationKey: AUTHORIZATION_KEY,
    locationName,
    cityName,
  });

  //使用useEffect效果,讓網頁轉譯後自動執行
  useEffect(() => { setCurrentTheme(moment === 'day' ? 'light' : 'dark'); }, [moment]);

  //網頁轉譯畫面
  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {console.log("render (App.js)")}
        {/*條件轉譯*/}
        {currentPage === 'WeatherCard' && (
          <WeatherCard
            cityName={cityName}
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            handleCurrentPageChange={handleCurrentPageChange}
          />
        )}
        {currentPage === 'WeatherSetting' && (
          <WeatherSetting
            handleCurrentPageChange={handleCurrentPageChange}
            cityNmae={cityName}
            handleCurrentCityChange={handleCurrentCityChange}
          />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;