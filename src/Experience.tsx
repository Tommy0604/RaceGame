// import { OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import Lights from './Lights';
import { Level } from './Level';
import { Perf } from 'r3f-perf';
import { Player } from './Player';
import useGame from './stores/useGame';
import Effects from './Effects';
// import { OrbitControls } from '@react-three/drei';

export default function Experience() {
  const blocksCount = useGame((state) => state.blocksCount);
  const blocksSeed = useGame((state) => state.blocksSeed);

  return (
    <>
      <Perf position="top-left" />

      {/* <OrbitControls makeDefault /> */}
      <color args={['#252731']} attach={'background'} />
      <Effects />
      {/* debug */}
      <Physics>
        <Lights />
        <Level count={blocksCount} seed={blocksSeed} />
        <Player />
      </Physics>
    </>
  );
}
