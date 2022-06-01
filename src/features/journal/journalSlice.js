import { createSlice, current } from '@reduxjs/toolkit';
import moment from 'moment';
import { monthlyCounterObj } from '../../constants/months';

const initialState = {
  entries: [],
  metaData: {},
};

export const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    addEntry: (state, { payload }) => {
      if (!payload.name || !payload.feeling || !payload.entry) return;
      state.entries.push(payload);

      const entryFeeling = payload.feeling;
      const entryMonth = moment.unix(payload.date).format('MMMM');
      const entryYear = moment.unix(payload.date).format('YYYY');

      if (!state.metaData[entryYear]) {
        state.metaData[entryYear] = monthlyCounterObj;
      }

      state.metaData[entryYear][entryFeeling][entryMonth]++;
    },

    removeJournal: (state) => {
      state.entries = [];
    },

    importEntries: (state, { payload }) => {
      state.entries = payload;
    },

    updateEntry: (state, { payload }) => {
      const entryId = payload.id;
      const filteredEntry = state.entries.filter(
        (entry) => entry.id !== entryId
      );
      state.entries = filteredEntry;
      state.entries.push(payload);
    },
    removeEntry: (state, { payload }) => {
      const entryId = payload.id;
      const filteredEntry = state.entries.filter(
        (entry) => entry.id !== entryId
      );
      state.entries = filteredEntry;
    },
    sortEntries: (state, { payload }) => {
      const feelingKey = {
        loved: 6,
        happy: 5,
        calm: 4,
        anxious: 3,
        sad: 2,
        angry: 1,
      };

      switch (payload) {
        case 'newstFirst':
          state.entries = state.entries.sort((a, b) =>
            a.date < b.date ? 1 : -1
          );
          break;
        case 'oldestFirst':
          state.entries = state.entries.sort((a, b) =>
            a.date > b.date ? 1 : -1
          );
          break;
        case 'positivesFirst':
          state.entries = state.entries.sort((a, b) => {
            const aFeelingKey = feelingKey[a.feeling];
            const bFeelingKey = feelingKey[b.feeling];
            return aFeelingKey < bFeelingKey ? 1 : -1;
          });
          break;
        case 'negativesFirst':
          state.entries = state.entries.sort((a, b) => {
            const aFeelingKey = feelingKey[a.feeling];
            const bFeelingKey = feelingKey[b.feeling];
            return aFeelingKey > bFeelingKey ? 1 : -1;
          });
          break;
        case 'longestFirst':
          state.entries = state.entries.sort((a, b) => {
            return a.entry.length < b.entry.length ? 1 : -1;
          });
          break;
        case 'shortestFirst':
          state.entries = state.entries.sort((a, b) => {
            return a.entry.length > b.entry.length ? 1 : -1;
          });
          break;
      }
    },
  },
});

export const {
  addEntry,
  removeEntry,
  sortEntries,
  importEntries,
  updateEntry,
  removeJournal,
} = journalSlice.actions;

export default journalSlice.reducer;
