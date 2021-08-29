/*** 
 * 把fetchCurrentWeather與fetchForecastWeather兩個函式從APP()裡獨立出來
 * 改寫成custom hook
***/

import { useState, useEffect, useCallback } from "react";

//API-1：取得天氣觀測資料
//與網頁的重新整理(onclick事件)綁定
const fetchCurrentWeather = ({ authorizationKey, locationName }) => {
    //在fetch前面加上return,直接把fetch API回傳的promise再回傳出去
    return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`)
        .then((response) => response.json())
        .then((data) => {
            //取出資料
            const locationData = data.records.location[0];
            //將風速和氣溫資料取出
            const weatherElements = locationData.weatherElement.reduce(
                (neededElements, item) => {
                    if (['WDSD', 'TEMP'].includes(item.elementName)) {
                        neededElements[item.elementName] = item.elementValue;
                    }
                    return neededElements;
                }, {}
            );
            //改以把取得的資料回傳出去，而不是setWeatherElement
            return {
                locationName: locationData.locationName,
                windSpeed: weatherElements.WDSD,
                temperature: weatherElements.TEMP,
                observationTime: locationData.time.obsTime,
            }
        });
};

//API-2：取得天氣預報資料
const fetchForecastWeather = ({authorizationKey, cityName}) => {
    //在fetch前面加上return,直接把fetch API回傳的promise再回傳出去
    return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`)
        .then((response) => response.json())
        .then((data) => {
            //取出某縣市的預報資料
            const locationData = data.records.location[0];
            const weatherElements = locationData.weatherElement.reduce(
                (neededElements, item) => {
                    if (['Wx', 'PoP', 'CI'].includes(item.elementName)) {
                        neededElements[item.elementName] = item.time[0].parameter;
                    }
                    return neededElements;
                }, {}
            );
            return {
                description: weatherElements.Wx.parameterName,
                weatherCode: weatherElements.Wx.parameterValue,
                rainPossibility: weatherElements.PoP.parameterName,
                comfortability: weatherElements.CI.parameterName,
            };
        });
};

const useWeatherAPI = ({ locationName, cityName, authorizationKey}) => {
    //設定氣象
    const [weatherElement, setWeatherElement] = useState({
        locationName: '',
        description: '',
        windSpeed: 0,
        temperature: 0,
        rainPossibility: 0,
        observationTime: new Date(),
        comfortability: '',
        weatherCode: 0,
        isLoading: true,
    });

    //搭配useCallback概念把fetchData從useEffect分離出來
    const fetchData = useCallback(async () => {
        setWeatherElement((prevState) => ({
            //在開始拉取資料前,先設定載入中的狀態
            ...prevState,
            isLoading: true,
        }));
        //使用promise.all與await等待兩隻API都取得回應後再繼續
        const [currentWeather, forecastWeather] = await Promise.all([
            fetchCurrentWeather({ authorizationKey, locationName }),
            fetchForecastWeather({ authorizationKey, cityName }),
        ]);
        //把取到的資料透過物件的解構賦值放入
        setWeatherElement({
            ...currentWeather,
            ...forecastWeather,
            isLoading: false,
        });
    }, [authorizationKey, locationName, cityName]);

    //加入useEffect，發揮載入時便取得氣象資料的功效
    //畫面轉譯後(render)和React本身無關但卻需要執行的動作稱為副作用(effect)
    //故而在畫面轉譯後就會自動執行useEffect函式
    //[dependencies]陣列指向fetchData陣列,與舊有fetchData不一致時才抓取資料
    useEffect(() => { fetchData(); }, [fetchData]);

    return [weatherElement, fetchData];
};

export default useWeatherAPI;