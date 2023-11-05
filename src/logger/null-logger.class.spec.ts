import {NullLogger} from "./null-logger.class";

describe('NullLogger', () => {
    let nullLogger: NullLogger;

    beforeEach(() => {
        nullLogger = new NullLogger();
    });

    it('should return null for error messages', () => {
        const result = nullLogger.error('Error message');
        expect(result).toBeNull();
    });

    it('should return null for log messages', () => {
        const result = nullLogger.log('Log message');
        expect(result).toBeNull();
    });

    it('should return null for warning messages', () => {
        const result = nullLogger.warn('Warning message');
        expect(result).toBeNull();
    });
});
