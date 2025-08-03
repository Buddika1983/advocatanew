"use client";

import { FaustProvider, client } from "../../lib/faust";

export default function FaustWrapper({ children }) {
  return <FaustProvider client={client()}>{children}</FaustProvider>;
}
