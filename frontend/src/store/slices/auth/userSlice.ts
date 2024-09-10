import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'

export type UserState = {
    avatar?: string
    nombre?: string
    apellido?: string
    email?: string
    rol?: string
    authority?: string[]
}

const initialState: UserState = {
    avatar: '',
    nombre: '',
    apellido: '',
    email: '',
    rol: '',
    authority: [],
}

const userSlice = createSlice({
    name: `${SLICE_BASE_NAME}/user`,
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.avatar = action.payload?.avatar
            state.email = action.payload?.email
            state.nombre = action.payload?.nombre
            state.apellido = action.payload?.apellido
            state.rol = action.payload?.rol
            state.authority = action.payload?.authority
        },
    },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
