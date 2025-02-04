import Typewriter from 'typewriter-effect';

export function Jumbotron({ text }) {
  return (
    <Typewriter
      options={{
        strings: text,
        autoStart: true,
        loop: true,
      }}
    />
  );
}
