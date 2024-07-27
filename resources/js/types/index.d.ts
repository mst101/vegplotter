import type { Config } from 'ziggy-js';
import type Konva from 'konva';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

type DateTime = string;

export type ButtonType = 'button' | 'submit' | 'reset' | undefined;

export type Nullable<T> = T | null;

export type TeamUser = Nullable<
    User & {
        all_teams?: Team[];
        current_team?: Team;
    }
>;

export interface User {
    id: number;
    name: string;
    email: string;
    current_team_id: Nullable<number>;
    profile_photo_path: Nullable<string>;
    profile_photo_url: string;
    two_factor_enabled: boolean;
    email_verified_at: Nullable<DateTime>;
    created_at: DateTime;
    updated_at: DateTime;
}

interface UserMembership extends User {
    membership: {
        role: string;
    };
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: Auth;
    ziggy: Config & { location: string };
    jetstream: {
        canCreateTeams: boolean;
        canManageTwoFactorAuthentication: boolean;
        canUpdatePassword: boolean;
        canUpdateProfileInformation: boolean;
        flash: {
            banner: string;
            bannerStyle: string;
            token: string;
        };
        hasAccountDeletionFeatures: boolean;
        hasApiFeatures: boolean;
        hasTeamFeatures: boolean;
        hasTermsAndPrivacyPolicyFeature: boolean;
        managesProfilePhotos: boolean;
        hasEmailVerification: boolean;
        errorBags: Record<string, string>;
        errors: Record<string, string>;
    };
};

export interface Team {
    id: number;
    name: string;
    personal_team: boolean;
    created_at: DateTime;
    updated_at: DateTime;
}

export interface Auth {
    user: Nullable<
        User & {
            all_teams?: Team[];
            current_team?: Team;
        }
    >;
}

export interface Session {
    id: number;
    ip_address: string;
    is_current_device: boolean;
    agent: {
        is_desktop: boolean;
        platform: string;
        browser: string;
    };
    last_active: DateTime;
}

export interface ApiToken {
    id: number;
    name: string;
    abilities: string[];
    last_used_ago: Nullable<DateTime>;
    created_at: DateTime;
    updated_at: DateTime;
}

export interface JetstreamTeamPermissions {
    canAddTeamMembers: boolean;
    canDeleteTeam: boolean;
    canRemoveTeamMembers: boolean;
    canUpdateTeam: boolean;
    canUpdateTeamMembers: boolean;
}

export interface Role {
    key: string;
    name: string;
    permissions: string[];
    description: string;
}

export interface TeamInvitation {
    id: number;
    team_id: number;
    email: string;
    role: Nullable<string>;
    created_at: DateTime;
    updated_at: DateTime;
}

// Custom types
export interface ModelOrig {
    tables: Map<string, TableConfig>;
    chairs: Map<string, ChairConfig>;
}

export interface Model {
    tables: Map<string, ModelTable>;
    chairs: Map<string, ChairConfig>;
}

export interface Position {
    x: number;
    y: number;
}

export interface TableConfig {
    id?: string;
    shape: 'square-4' | 'square-6' | 'circle-4';
    position: Position;
}

export interface ModelTable extends Konva.ShapeConfig {
    id?: string;
    shape?: 'square-4' | 'square-6' | 'circle-4';
    position?: Position;
}

export interface TableConfigOrig {
    id?: string;
    shape: 'square-4' | 'square-6' | 'circle-4';
    x: number;
    y: number;
}

export interface PlanDataOrig {
    tables: TableConfigOrig[];
}

export interface PlanData {
    tables: TableConfig[];
}

export interface ChairPosition {
    id?: string;
    x: number;
    y: number;
    angle: number;
}

export interface TableData {
    shape: 'rect' | 'circle';
    width?: number;
    height?: number;
    radius?: number;
    chairPositions: ChairPosition[];
}

export interface OuterRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Change {
    obj: {
        type: 'table' | 'chair'; // Add other types as needed
        id: string;
    };
    before: Record<string, any>;
    after: Record<string, any>;
}
