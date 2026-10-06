import { RegisterVerifierClient } from "@/components/product/register-client"
import { chain } from "@/lib/chain"
import { registerEntries } from "@/lib/sample"

/** Builds the sample register's hash chain on the server; the visitor's browser re-verifies it. */
export async function RegisterVerifier() {
  return <RegisterVerifierClient entries={await chain(registerEntries)} />
}
