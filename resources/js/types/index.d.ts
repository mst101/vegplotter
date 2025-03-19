import type { Config } from 'ziggy-js';
// import type Table from '@/Models/Table';
// import type Chair from '@/Models/Chair';

interface User {
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

type DateTime = string;

type ButtonType = 'button' | 'submit' | 'reset' | undefined;

type Nullable<T> = T | null;

type TeamUser = Nullable<
    User & {
        all_teams?: Team[];
        current_team?: Team;
    }
>;

interface UserMembership extends User {
    membership: {
        role: string;
    };
}

type PageProps<
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

interface Team {
    id: number;
    name: string;
    personal_team: boolean;
    created_at: DateTime;
    updated_at: DateTime;
}

interface Auth {
    user: Nullable<
        User & {
            all_teams?: Team[];
            current_team?: Team;
        }
    >;
}

interface Session {
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

interface ApiToken {
    id: number;
    name: string;
    abilities: string[];
    last_used_ago: Nullable<DateTime>;
    created_at: DateTime;
    updated_at: DateTime;
}

interface JetstreamTeamPermissions {
    canAddTeamMembers: boolean;
    canDeleteTeam: boolean;
    canRemoveTeamMembers: boolean;
    canUpdateTeam: boolean;
    canUpdateTeamMembers: boolean;
}

interface Role {
    key: string;
    name: string;
    permissions: string[];
    description: string;
}

interface TeamInvitation {
    id: number;
    team_id: number;
    email: string;
    role: Nullable<string>;
    created_at: DateTime;
    updated_at: DateTime;
}

// Custom types
interface Chair {
    id: string;
    position: Position;
    angle: number;
    visible: boolean;
    parentId: string;
}

interface Table {
    id: string;
    position: Position;
    rotation: number;
    diet: Diet;
    tableType: string;
    focus: boolean;
    chairs: Chair[];
}

// Define the common properties for all table shapes
interface BaseTableData {
    diet?: string;
    focus?: boolean;
    tableType?: string;
    chairPositions: ChairPosition[];
    shape: 'rect' | 'circle';
}

// Rectangle-specific properties
interface RectTableData extends BaseTableData {
    shape: 'rect';
    width: number;
    height: number;
    radius?: never; // Explicitly not allowed for rectangles
}

// Circle-specific properties
interface CircleTableData extends BaseTableData {
    shape: 'circle';
    radius: number;
    width?: never; // Explicitly not allowed for circles
    height?: never; // Explicitly not allowed for circles
}

// The final union type
type TableData = RectTableData | CircleTableData;

type Diet = 'Omnivore' | 'Vegetarian' | 'Pescatarian';

interface Model {
    flowerBeds: Map<string, FlowerBeds>;
    chairs: Map<string, Chair>;
}

interface TableConfig {
    shape: string;
    x: number;
    y: number;
}

interface PlanData {
    tables: TableConfig[];
}

interface Position {
    x: number;
    y: number;
}

interface Change {
    obj: {
        type: 'table' | 'chair'; // Add other types as needed
        id: string;
    };
    before: Record<string, any>;
    after: Record<string, any>;
}

interface ChairPosition {
    x: number;
    y: number;
    angle: number;
}

interface FlowerBed {
    rotation: number;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
    scaleX?: number;
    scaleY?: number;
    stroke: string;
    strokeWidth: number;
    draggable: boolean;
    dragBoundFunc: (pos: Position) => Position;
}
