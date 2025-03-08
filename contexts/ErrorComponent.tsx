import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ErrorComponent = ({text}:{text:string}) => {
  return (
    <View>
      <Text>{text}</Text>
    </View>
  )
}

export default ErrorComponent

const styles = StyleSheet.create({})