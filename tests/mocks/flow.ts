import { FlowDefinition } from "../../src";
import { UserModel } from "./user";

class TestFlow extends FlowDefinition<UserModel> {}

export const Flow = new TestFlow();
