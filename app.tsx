import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, Button, Alert } from 'react-native';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis, VictoryLegend } from 'victory-native';
import { calculateEnclosure } from './src/math/tsMath';
import { presets } from './src/presets';
import { exportDXF } from './src/export/exportDXF';

export default function App() {
  const [driverParams, setDriverParams] = useState({
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

  const [boxParams, setBoxParams] = useState({
    type: 'ported',
    volume: '',
    tuning: '',
    portDiameter: '',
    slotWidth: '',
    slotHeight: ''
  });

  const [graphData, setGraphData] = useState([]);
  const [velocityData, setVelocityData] = useState([]);
  const handleCalculate = () => {
    try {
      const results = calculateEnclosure(driverParams, boxParams);
      setGraphData(results.splCurve);
      setVelocityData(results.velocityCurve);

      if (results.warnings.length > 0) {
        Alert.alert('Warnings', results.warnings.join('\n'));
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleExportDXF = () => {
    try {
      const dxf = exportDXF(boxParams);
      console.log('DXF Output:\n', dxf);
      Alert.alert('Export Complete', 'DXF has been printed to cons
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#111' }}>
      <ScrollView style={{ padding: 10 }}>
        <Text style={{ color: '#fff', fontSize: 22, marginBottom: 10 }}>Speaker Box Designer</Text>

        {/* Presets */}
        <View style={{ marginBottom: 15 }}>
          <Text style={{ color: '#aaa', marginBottom: 5 }}>Load Driver Preset:</Text>
          {presets.map((p, idx) => (
            <Button key={idx} title={p.name} onPress={() => loadPreset(p)} />
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
              value={driverParams[key]}
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
              keyboardType="numeric"
              value={boxParams[key]}
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
        <Text style={{ color: '#fff', fontSize: 16, marginTop: 15 }}>SPL Curve</Text>
        <VictoryChart theme={VictoryTheme.material} height={250}>
          <VictoryAxis label="Frequency (Hz)" style={{ tickLabels: { fontSize: 8 } }} />
          <VictoryAxis dependentAxis label="SPL (dB)" style={{ tickLabels: { fontSize: 8 } }} />
          <VictoryLine
            data={graphData}
            x="freq"
            y="spl"
            style={{ data: { stroke: "#4cafef" } }}
          />
        </VictoryChart>

        {/* Port Velocity Chart */}
        <Text style={{ color: '#fff', fontSize: 16, marginTop: 15 }}>Port Velocity</Text>
        <VictoryChart theme={VictoryTheme.material} height={250}>
          <VictoryAxis label="Frequency (Hz)" style={{ tickLabels: { fontSize: 8 } }} />
          <VictoryAxis dependentAxis label="Velocity (m/s)" style={{ tickLabels: { fontSize: 8 } }} />
          <VictoryLine
            data={velocityData}
            x="freq"
            y="velocity"
            style={{ data: { stroke: "#f54242" } }}
          />
        </VictoryChart>
      </ScrollView>
    </SafeAreaView>
  );
}

