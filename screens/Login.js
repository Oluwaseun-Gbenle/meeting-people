import { View, Text, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Login = () => {
  return (
        <SafeAreaView>
        <View>
        <TouchableOpacity
          //onPress={signInWithGoogle}
          style={{ marginHorizontal: "25%" }}
          className=" bg-green-500 p-4 w-52 rounded-2xl"
        >
          <Text className="font-semibold text-center">Sign in & get swiping</Text>
        </TouchableOpacity>
      </View>
      </SafeAreaView>
  )
}

export default Login