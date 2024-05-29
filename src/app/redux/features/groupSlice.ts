import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Group } from "@/app/models/Group";


interface GroupState {
  groups: Group[];
  error: string | null;
  groupsError: string | null;
}

const initialState: GroupState = {
  groups: [],
  error: null,
  groupsError: null,
};

const groupsSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    getGroupsError(state, action: PayloadAction<string>) {
      state.groupsError = action.payload;
    },
    updateGroups(state, action: PayloadAction<Group[]>) {
      state.groups = action.payload;
    },
  },
});

export const {
  getGroupsError,
  updateGroups,
} = groupsSlice.actions;

export default groupsSlice.reducer;
