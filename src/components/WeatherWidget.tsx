
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { getWeatherByCoordinates } from '../services/ContactService';

interface WeatherWidgetProps {
  latitude: number;
  longitude: number;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ latitude, longitude }) => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await getWeatherByCoordinates(latitude, longitude);
        setWeather(data);
      } catch (error) {
        console.error('Error al cargar el clima:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando clima...</Text>
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={styles.container}>
        <Text>No se pudo cargar el clima.</Text>
      </View>
    );
  }

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

  return (
    <View style={styles.container}>
      <Text style={styles.location}>{weather.name}</Text>
      <Image source={{ uri: iconUrl }} style={styles.icon} />
      <Text style={styles.temperature}>{Math.round(weather.main.temp)}°C</Text>
      <Text style={styles.description}>{weather.weather[0].description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: 120,
  },
  location: {
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  icon: {
    width: 50,
    height: 50,
  },
  temperature: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    textTransform: 'capitalize',
    textAlign: 'center',
  },
});

export default WeatherWidget;
