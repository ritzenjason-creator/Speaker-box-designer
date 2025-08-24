import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, Button, Alert, Platform } from 'react-native';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis } from 'victory-native';
import { calculateEnclosure } from './src/math/tsMath';
import { presets } from './src/presets';
import { exportDXF } from './src/export/exportDXF';

// Define types for our data
interface DriverParams {
  Vas: string;
  Qts: string;
  Fs: string;
  Qes: string;
  Sd: string;
  Xmax: string;
  Re: string;
  Le: string;
  Bl: string;
}

interface BoxParams {
  type: string;
  volume: string;
  tuning: string;
  portDiameter: string;
  slotWidth: string;
  slotHeight: string;
}

interface GraphDataPoint {
  freq: number;
  spl: number;
}

interface VelocityDataPoint {
  freq: number;
  velocity: number;
}

interface Preset {
  name: string;
  Vas: string;
  Qts: string;
  Fs: string;
  Qes: string;
  Sd: string;
  Xmax: string;
  Re: string;
  Le: string;
  Bl: string;
}

export default function App() {
  const [driverParams, setDriverParams] = useState<DriverParams>({
    Vas: '',
    Qts: '',
    Fs: '',
    Qes: '',
    Sd: '',
    Xmax: '',
    Re: '',
    Le: '',
    Bl: ''
  });

  const [boxParams, setBoxParams] = useState<BoxParams>({
    type: 'ported',
    volume: '',
    tuning: '',
    portDiameter: '',
    slotWidth: '',
    slotHeight: ''
  });

  const [graphData, setGraphData] = useState<GraphDataPoint[]>([]);
  const [velocityData, setVelocityData] = useState<VelocityDataPoint[]>([]);
  
  const handleCalculate = () => {
    try {
      const results = calculateEnclosure(driverParams, boxParams);
      setGraphData(results.splCurve);
      setVelocityData(results.velocityCurve);

      if (results.warnings.length > 0) {
        Alert.alert('Warnings', results.warnings.join('\n'));
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const handleExportDXF = () => {
    try {
      const dxf = exportDXF(boxParams);
      console.log('DXF Output:\n', dxf);
      Alert.alert('Export Complete', 'DXF has been printed to console');
    } catch (err: any) {
      Alert.alert('Export Error', err.message);
    }
  };

  const loadPreset = (preset: Preset) => {
    // Extract only the driver parameters, excluding the name
    const { name, ...driverParams } = preset;
    setDriverParams(driverParams);
    Alert.alert('Preset Loaded', `${name} parameters loaded`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#111' }}>
      <ScrollView style={{ padding: 10 }}>
        <Text style={{ color: '#fff', fontSize: 22, marginBottom: 10 }}>Speaker Box Designer</Text>

        {/* Presets */}
        <View style={{ marginBottom: 15 }}>
          <Text style={{ color: '#aaa', marginBottom: 5 }}>Load Driver Preset:</Text>
          {presets.map((p, idx) => (
            <View key={idx} style={{ marginBottom: 5 }}>
              <Button title={p.name} onPress={() => loadPreset(p)} />
            </View>
          ))}
        </View>

        {/* Driver Parameters */}
        <Text style={{ color: '#fff', fontSize: 18, marginBottom: 5 }}>Driver Parameters</Text>
        {Object.keys(driverParams).map((key) => (
          <View key={key} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ color: '#aaa', width: 90 }}>{key}:</Text>
            <TextInput
              style={{
                flex: 1,
                backgroundColor: '#222',
                color: '#fff',
                padding: 5,
                borderRadius: 5
              }}
              keyboardType="numeric"
              value={driverParams[key as keyof DriverParams]}
              onChangeText={(val) => setDriverParams({ ...driverParams, [key]: val })}
            />
          </View>
        ))}

        {/* Box Parameters */}
        <Text style={{ color: '#fff', fontSize: 18, marginTop: 15, marginBottom: 5 }}>Box Parameters</Text>
        {Object.keys(boxParams).map((key) => (
          <View key={key} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ color: '#aaa', width: 90 }}>{key}:</Text>
            <TextInput
              style={{
                flex: 1,
                backgroundColor: '#222',
                color: '#fff',
                padding: 5,
                borderRadius: 5
              }}
              keyboardType={key === 'type' ? 'default' : 'numeric'}
              value={boxParams[key as keyof BoxParams]}
              onChangeText={(val) => setBoxParams({ ...boxParams, [key]: val })}
            />
          </View>
        ))}

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15 }}>
          <Button title="Calculate" onPress={handleCalculate} />
          <Button title="Export DXF" onPress={handleExportDXF} />
        </View>
        
        {/* SPL Chart */}
        {graphData.length > 0 && (
          <>
            <Text style={{ color: '#fff', fontSize: 16, marginTop: 15 }}>SPL Curve</Text>
            <VictoryChart theme={VictoryTheme.material} height={250}>
              <VictoryAxis label="Frequency (Hz)" style={{ tickLabels: { fontSize: 8, fill: '#fff' } }} />
              <VictoryAxis dependentAxis label="SPL (dB)" style={{ tickLabels: { fontSize: 8, fill: '#fff' } }} />
              <VictoryLine
                data={graphData}
                x="freq"
                y="spl"
                style={{ data: { stroke: "#4cafef" } }}
              />
            </VictoryChart>
          </>
        )}

        {/* Port Velocity Chart */}
        {velocityData.length > 0 && (
          <>
            <Text style={{ color: '#fff', fontSize: 16, marginTop: 15 }}>Port Velocity</Text>
            <VictoryChart theme={VictoryTheme.material} height={250}>
              <VictoryAxis label="Frequency (Hz)" style={{ tickLabels: { fontSize: 8, fill: '#fff' } }} />
              <VictoryAxis dependentAxis label="Velocity (m/s)" style={{ tickLabels: { fontSize: 8, fill: '#fff' } }} />
              <VictoryLine
                data={velocityData}
                x="freq"
                y="velocity"
                style={{ data: { stroke: "#f54242" } }}
              />
            </VictoryChart>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}