export * from './account.interface';
export * from './post.interface';

export interface HealthCheck {
    uptime: number,
    message: string,
    timestamp: number
};