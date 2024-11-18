import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getGrade, updateGrade } from "../action/grade";

const gradeSlice = createSlice({
  name: "grade",
  initialState: {
    grade: [],

    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGrade.fulfilled, (state, action) => {
        state.loading = false;

        state.grade = action.payload.result;
      })
      .addCase(getGrade.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateGrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGrade.fulfilled, (state: any, action: any) => {
        state.loading = false;
        const updatedGrade = {
          ...action.meta.arg.data,
          id: action.meta.arg.id,
        }; // Getting updated grade from the meta.arg
        console.log("updatedGrade: ", updatedGrade);

        // Find the index of the grade with the matching id
        const index = state.grade.findIndex(
          (grade: any) => grade.id === updatedGrade.id
        );
        if (index !== -1) {
          // Update the grade entry with the new data
          state.grade[index] = {
            ...state.grade[index],
            examScores: {
              exitExam: updatedGrade.exitExam,
              writenExam: updatedGrade.writenExam,
              practiceExam: updatedGrade.practiceExam,
            },
          };
        }
      })
      .addCase(updateGrade.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default gradeSlice.reducer;
