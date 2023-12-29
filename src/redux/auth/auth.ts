import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';

export interface AuthState {
	address: string;
  role: string;
  nftId: number | null;
  withdrawableBalance: number;
  totalRevenue: number;
  vipLvl: number;
  lvl: number;
  lowPotentiel: number;
  nftInfo: any[];
  downlines: number | string;
  referralIncome: number;
  isEmty: boolean;
  loading: boolean;
	hidden: boolean;
  change: boolean
	status: 'idle' | 'loading' | 'failed';
  chainId: string;

}

const initialState: AuthState = {
	address: '',
  nftId: null,
  role: '',
  withdrawableBalance: 0,
  totalRevenue: 0,
  vipLvl: 1,
  lvl: 1,
  lowPotentiel: 0,
  isEmty: true,
  nftInfo: [],
  downlines: 0,
  referralIncome: 0,
  loading: false,
	hidden: true,
	status: 'loading',
  change: false,
  chainId: '0x5dd'
};


export const AuthSlice = createSlice({
	name: 'Auth',
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		
    setAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
    },
    setNftInfo: (state, action: PayloadAction<any[]>) => {
      state.nftInfo = action.payload;
    },
    setEmty: (state, action: PayloadAction<boolean>) => {
      state.isEmty = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setHidden: (state, action: PayloadAction<boolean>) => {
      state.hidden = action.payload;
    },
    setChange: (state, action: PayloadAction<boolean>) => {
      state.change = action.payload;
    },
    setWithdrawableBalance: (state, action: PayloadAction<number>) => {
      state.withdrawableBalance = action.payload;
    },
    setTotalRevenue: (state, action: PayloadAction<number>) => {
      state.totalRevenue = action.payload;
    },
    setVipLvl: (state, action: PayloadAction<number>) => {
      state.vipLvl = action.payload;
    },
    setClear: (state) => {
      state.address = '';
      state.role = '';
      state.nftInfo = [];
      state.isEmty = true;
      state.loading = false;
      state.hidden = true;
      state.change = false;
      state.withdrawableBalance = 0;
      state.totalRevenue = 0;
      state.vipLvl = 1;
    },
    setnftId : (state, action: PayloadAction<number>) => {
      state.nftId = action.payload;
    },
    setDownlines: (state, action: PayloadAction<number | string>) => {
      state.downlines = action.payload;
    },
    setReferralIncome: (state, action: PayloadAction<number>) => {
      state.referralIncome = action.payload;
    },
    setLvl: (state, action: PayloadAction<number>) => {
      state.lvl = action.payload;
    },
    setLowPotentiel: (state, action: PayloadAction<number>) => {
      state.lowPotentiel = action.payload;
    },
    setChainId: (state, action: PayloadAction<string>) => {
      state.chainId = action.payload;
    }
	},
	
});

export const {
  setAddress,
  setRole,
  setNftInfo,
  setEmty,
  setLoading,
  setHidden,
  setChange,
  setWithdrawableBalance,
  setTotalRevenue,
  setVipLvl,
  setClear,
  setnftId,
  setDownlines,
  setReferralIncome,
  setLvl, 
  setLowPotentiel,
  setChainId
} = AuthSlice.actions;


// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectData = (state: RootState) => ({
  address: state.Auth.address,
  role: state.Auth.role,
  nftInfo: state.Auth.nftInfo,
  isEmty: state.Auth.isEmty,
  loading: state.Auth.loading,
  hidden: state.Auth.hidden,
  change: state.Auth.change,
  withdrawableBalance: state.Auth.withdrawableBalance,
  totalRevenue: state.Auth.totalRevenue,
  vipLvl: state.Auth.vipLvl,
  nftId: state.Auth.nftId,
  downlines: state.Auth.downlines,
  referralIncome: state.Auth.referralIncome,
  lvl: state.Auth.lvl, 
  lowPotentiel: state.Auth.lowPotentiel,
  chainId: state.Auth.chainId
});



export default AuthSlice.reducer;
