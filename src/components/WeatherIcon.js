import React, { useMemo } from 'react';
import styled from '@emotion/styled';
//留意svg路徑
import { ReactComponent as DayClear } from './../images/day-clear.svg';
import { ReactComponent as DayCloudy } from './../images/day-cloudy.svg';
import { ReactComponent as DayCloudyFog } from './../images/day-cloudy-fog.svg';
import { ReactComponent as DayFog } from './../images/day-fog.svg';
import { ReactComponent as DayPartiallyClearWithRain } from './../images/day-partially-clear-with-rain.svg';
import { ReactComponent as DaySnowing } from './../images/day-snowing.svg';
import { ReactComponent as DayThunderstorm } from './../images/day-thunderstorm.svg';
import { ReactComponent as NightClear } from './../images/night-clear.svg';
import { ReactComponent as NightCloudy } from './../images/night-cloudy.svg';
import { ReactComponent as NightCloudyFog } from './../images/night-cloudy-fog.svg';
import { ReactComponent as NightFog } from './../images/night-fog.svg';
import { ReactComponent as NightPartiallyClearWithRain } from './../images/night-partially-clear-with-rain.svg';
import { ReactComponent as NightSnowing } from './../images/night-snowing.svg';
import { ReactComponent as NightThunderstorm } from './../images/night-thunderstorm.svg';


//為了美觀，外面多包一層div
//原本是 const DayCloudy = styled(DayCloudyIcon)
const IconContainer = styled.div`
  flex-basis: 30%;
  svg {
      max-height: 110px;
  }
`;

//天氣型態(自定義)vs天氣代碼(中央氣象局資料裡原本就沒有40)
const weatherTypes = {
    isClear: [1],
    isCloudy: [2, 3, 4, 5, 6, 7],
    isPartiallyClearWithRain: [8, 9, 10, 11, 12, 13, 14, 19, 20, 29, 30, 31, 32, 38, 39],
    isThunderstorm: [15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41],
    isSnowing: [23, 37, 42],
    isFog: [24],
    isCloudyFog: [25, 26, 27, 28],
};

//天氣型態(自定義)vs天氣圖示
const weatherIcons = {
    day: {
        isThunderstorm: <DayThunderstorm />,
        isClear: <DayClear />,
        isCloudyFog: <DayCloudyFog />,
        isCloudy: <DayCloudy />,
        isFog: <DayFog />,
        isPartiallyClearWithRain: <DayPartiallyClearWithRain />,
        isSnowing: <DaySnowing />,
    },
    night: {
        isThunderstorm: <NightThunderstorm />,
        isClear: <NightClear />,
        isCloudyFog: <NightCloudyFog />,
        isCloudy: <NightCloudy />,
        isFog: <NightFog />,
        isPartiallyClearWithRain: <NightPartiallyClearWithRain />,
        isSnowing: <NightSnowing />,
    },
};

//API取得的天氣代碼對應的天氣型態
//Object.entries將key:value的結構轉為陣列
//Array.find((value,index)=>) 將解析後的陣列值從左至右帶入Array.find裡
//運算式1 || 運算式2  運算式1可以被轉換成true的話，回傳運算式1; 否則，回傳運算式2
//左側 [weatherType] 一開始是沒有值的
const weatherCode2Type = (weatherCode) => {
    const [weatherType] = Object.entries(weatherTypes).find(([weatherType, weatherCodes]) => weatherCodes.includes(Number(weatherCode))) || [];
    return weatherType;
};

const WeatherIcon = ({ weatherCode, moment }) => {
    //使用useMemo,減少重複計算
    const weatherType = useMemo(()=>weatherCode2Type(weatherCode),[weatherCode]);
    const weatherIcon = weatherIcons[moment][weatherType];
    return <IconContainer>{weatherIcon}</IconContainer>;
};

export default WeatherIcon;