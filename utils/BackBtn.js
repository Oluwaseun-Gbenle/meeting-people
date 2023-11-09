import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react';
import { Feather } from '@expo/vector-icons';

export default function BackBtn({onPress}) {
  return (
    <TouchableOpacity onPress={onPress} className="m-3">
      <Feather name="chevron-left" size={35} color="black" />
    </TouchableOpacity>
  )
}