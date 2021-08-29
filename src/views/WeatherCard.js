import React from 'react';
import styled from '@emotion/styled';
//解決跨瀏覽器時間問題的套件
import dayjs from 'dayjs';
//匯入自定義元件
import WeatherIcon from './../components/WeatherIcon';
//匯入資料夾圖案
import { ReactComponent as AirFlowIcon } from './../images/air-flow.svg';
import { ReactComponent as RainIcon } from './../images/rain.svg';
import { ReactComponent as RefreshIcon } from './../images/refresh.svg'; //重新整理
import { ReactComponent as LoadingIcon } from './../images/loading.svg'; //載入
import { ReactComponent as CogIcon } from './../images/cog.svg'; //齒輪

//透過@emition/styled幫元件添加樣式
const WeatherCardWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.backgroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`;
const Location = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 20px;
`;
const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 30px;
`;
const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;
const Temperature = styled.div`
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;
const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;
const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;
const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;
const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({ theme }) => theme.textColor};
  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    /* 定義好keyframes後,使用rotate在svg圖示上 */
    animation: rotate infinite 1.5s linear;
    /* 只有在載入資料時才旋轉 */
    animation-duration: ${({ isLoading }) => (isLoading ? '1.5s' : '0s')};
  }
  /* 定義旋轉的動畫效果,並取名為rotate */
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;
const Cog = styled(CogIcon)`
  position: absolute;
  top: 30px;
  right: 15px;
  width: 15px;
  height: 15px;
  cursor: pointer;
`;


//從App.js取出傳入的props (weatherElement, moment, fetchData)
const WeatherCard = ({
  cityName,
  weatherElement,
  moment,
  fetchData,
  handleCurrentPageChange
}) => {
  //使用解構賦值讓版面更乾淨(對應設定氣象區塊)
  const {
    description,
    temperature,
    weatherCode,
    windSpeed,
    rainPossibility,
    isLoading,
    observationTime,
    comfortability,
  } = weatherElement;

  //為了與App.js的WeatherCard有所區隔，在此改名為WeatherCardWrapper
  //以下就是在JSX中使用上面圖示的程式用法
  return (
    <WeatherCardWrapper>
      {console.log("render (WeatherCard.js)")}
      <Location>{cityName}</Location>
      <Cog onClick={() => handleCurrentPageChange('WeatherSetting')} />
      <Description>{description}</Description>
      <CurrentWeather>
        <Temperature>
          {temperature} <Celsius>°C</Celsius>
        </Temperature>
        <WeatherIcon weatherCode={weatherCode} moment={moment} />
      </CurrentWeather>
      <AirFlow>
        <AirFlowIcon /> {windSpeed} m/h
      </AirFlow>
      <Rain>
        <RainIcon /> {rainPossibility} %
      </Rain>
      <Refresh onClick={fetchData}
        isLoading={isLoading}>
        最後觀測時間:
        {new Intl.DateTimeFormat('zh-TW',
          {
            hour: 'numeric',
            minute: 'numeric',
          }).format(dayjs(observationTime))
        }{' '}
        {isLoading ? <LoadingIcon /> : <RefreshIcon />}
      </Refresh>
    </WeatherCardWrapper>
  )
};

export default WeatherCard;