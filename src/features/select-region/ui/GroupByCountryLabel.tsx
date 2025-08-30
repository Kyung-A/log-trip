import React from 'react';
import { Text, View } from 'react-native';

export const GroupByCountryLabel = React.memo(
  ({ countryName, regions }: { countryName: string; regions: string[] }) => {
    return (
      <View className="px-2 py-1 bg-gray-100 rounded-md">
        <Text className="text-base">{countryName}</Text>
        <Text className="text-sm -mt-0.5 text-gray-600">{regions}</Text>
      </View>
    );
  },
);
