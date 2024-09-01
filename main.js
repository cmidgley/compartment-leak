import Debug from 'debug';
import Instrumentation from 'instrumentation';

const code = '(function(a) { if (typeof a === "undefined") return 34; else return 1 + 1; })();\n'.repeat(20);

const count = 100;
trace(`Leak test at ${new Date().toISOString()} for ${count} iterations\n`);

let i = 0;
const compartment = new Compartment();

// prepare for leak test by doing a garbage collect and capturing the usage
Debug.gc();
const startingChunkHeapSize = Instrumentation.get(Instrumentation.map('XS Chunk Heap Used'));
const startingSlotHeapSize = Instrumentation.get(Instrumentation.map('XS Slot Heap Used'));

for (; i < count; i++) {
	compartment.evaluate('');
}

// force a garbage collect and report the usage
Debug.gc();
const endingSlotHeapSize = Instrumentation.get(Instrumentation.map('XS Chunk Heap Used'));
const endingChunkHeapSize = Instrumentation.get(Instrumentation.map('XS Slot Heap Used'));

trace(`Chunk heap usage: ${endingChunkHeapSize - startingSlotHeapSize}\n`);
trace(`Slot heap usage: ${endingSlotHeapSize - startingChunkHeapSize}\n`);




