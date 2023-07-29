import { ApplicationCommandType, ComponentType, Interaction, InteractionType } from 'discord.js';
import { CommandType, EventType } from './structures';

/**
 * Construct unique ID for a given interaction object.
 * @param event The interaction object for which to create an ID.
 * @returns A unique string ID based on the type and properties of the interaction object.
 */
export function reconstruct<T extends Interaction>(event: T) {
    switch (event.type) {
        case InteractionType.MessageComponent: {
            return `${event.customId}_C${event.componentType}`;
        }
        case InteractionType.ApplicationCommand:
        case InteractionType.ApplicationCommandAutocomplete: {
            return `${event.commandName}_A${event.commandType}`;
        }
        //Modal interactions are classified as components for sern
        case InteractionType.ModalSubmit: {
            return `${event.customId}_C1`;
        }
    }
}
/**
 *
 * A magic number to represent any commandtype that is an ApplicationCommand.
 */
const appBitField = 0b000000001111;

// Each index represents the exponent of a CommandType.
// Every CommandType is a power of two.
export const CommandTypeDiscordApi = [
    1, // CommandType.Text
    ApplicationCommandType.ChatInput,
    ApplicationCommandType.User,
    ApplicationCommandType.Message,
    ComponentType.Button,
    ComponentType.StringSelect,
    1, //  CommandType.Modal
    ComponentType.UserSelect,
    ComponentType.RoleSelect,
    ComponentType.MentionableSelect,
    ComponentType.ChannelSelect,
];
/*
 * Generates a number based on CommandType.
 * This corresponds to an ApplicationCommandType or ComponentType
 * TextCommands are 0 as they aren't either or.
 */
function apiType(t: CommandType | EventType) {
    if (t === CommandType.Both || t === CommandType.Modal) return 1;
    return CommandTypeDiscordApi[Math.log2(t)];
}

/*
 * Generates an id based on name and CommandType.
 * A is for any ApplicationCommand. C is for any ComponentCommand
 * Then, another number generated by apiType function is appended
 */
export function create(name: string, type: CommandType | EventType) {
    const am = (appBitField & type) !== 0 ? 'A' : 'C';
    return name + '_' + am + apiType(type);
}
