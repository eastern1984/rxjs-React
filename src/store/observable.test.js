import { dataStore, state, initialState } from './observable';

describe('observable', () => {
    it('should return init state', () => {
        expect(state).toEqual(initialState);
    });
});