import { Container } from "@inlet/react-pixi";
import { memo, ReactElement, useMemo } from "react";
import { UText } from "./util";

type Props = {
  x: number,
  y: number,
  lH: number,
  line?: number,
  depth?: number,
  posX?: number,
  json: any,
  visible?: boolean,
  lines?: number
};

const jsonContainer = (
  props: Props,
  jsons: ReactElement[]
): [number, number] => {
  const gProps = {
    line: props.line!, depth: props.depth!, posX: props.posX!
  };
  if (props.posX === 0)
    jsons.push(<TextAt key={`${gProps.line}/-3`}
    text={`${('  ' + gProps.line).slice(-2)}`} col={0x666666}
    x={props.x} y={props.y} lH={props.lH} line={gProps.line} posX={-3}
  />);
  if (props.json instanceof Object) {
    jsons.push(<TextAt key={`${gProps.line}/${gProps.posX}`}
      text={(props.json instanceof Array) ? '[' : '{'} col={0x000000}
      x={props.x} y={props.y} lH={props.lH}
      line={gProps.line} posX={gProps.posX}
    />);
    gProps.line++;gProps.depth++;

    let f = false;
    for (const key of Object.keys(props.json)) {
      if (f) {
        jsons.push(
          <TextAt key={`${gProps.line}/${gProps.posX}`}
            text={','} col={0x000000}
            x={props.x} y={props.y} lH={props.lH}
            line={gProps.line} posX={gProps.posX}
          />
        );
        gProps.line++;
      }
      jsons.push(<TextAt key={`${gProps.line}/-3`}
        text={`${('  ' + gProps.line).slice(-2)}`} col={0x666666}
        x={props.x} y={props.y} lH={props.lH} line={gProps.line} posX={-3}
      />);
      gProps.posX = gProps.depth*2;
      if (!(props.json instanceof Array)) {
        jsons.push(
          <TextAt key={`${gProps.line}/${gProps.posX}`}
            text={`"${key}"`} col={0x007700}
            x={props.x} y={props.y} lH={props.lH}
            line={gProps.line} posX={gProps.posX}
          />
        );
        gProps.posX += (key as string).length+2;
        jsons.push(
          <TextAt key={`${gProps.line}/${gProps.posX}`}
            text={':'} col={0x000000}
            x={props.x} y={props.y} lH={props.lH}
            line={gProps.line} posX={gProps.posX}
          />
        );
        gProps.posX += 2;
      }
      [gProps.posX, gProps.line] = jsonContainer(Object.assign({
        x: props.x, y: props.y, lH: props.lH, json: props.json[key]
      }, gProps), jsons);
      f = true;
    }
    gProps.line++;gProps.depth--;

    jsons.push(<TextAt key={`${gProps.line}/-3`}
      text={`${('  ' + gProps.line).slice(-2)}`} col={0x666666}
      x={props.x} y={props.y} lH={props.lH} line={gProps.line} posX={-3}
    />);
    gProps.posX = gProps.depth*2;
    jsons.push(
      <TextAt key={`${gProps.line}/${gProps.posX}`}
        text={(props.json instanceof Array) ? ']' : '}'} col={0x000000}
        x={props.x} y={props.y} lH={props.lH}
        line={gProps.line} posX={gProps.posX}
      />
    );
    return [gProps.posX+1, gProps.line];
  }
  if (props.json.includes('.')) {
    jsons.push(
      <TextAt key={`${gProps.line}/${gProps.posX}`}
        text={`"${props.json}"`} col={0x0077FF}
        x={props.x} y={props.y} lH={props.lH}
        line={gProps.line} posX={gProps.posX}
        interactive={true} buttonMode={true}
        pointertap={() => window.open(`https://${props.json}`, '_blank')}
      />
    );
  } else {
    jsons.push(
      <TextAt key={`${gProps.line}/${gProps.posX}`}
        text={`"${props.json}"`} col={0xCC4400}
        x={props.x} y={props.y} lH={props.lH}
        line={gProps.line} posX={gProps.posX}
      />
    );
  }
  return [gProps.posX+props.json.length+2, gProps.line];
}

const JsonContainer = memo(function JsonContainer_(props: Props) {
  const jC: [number, ReactElement[]] = useMemo(() => {
    const jsons: ReactElement[] = [];
    const [_, line] = jsonContainer(
      Object.assign({posX: 0, line: 1, depth: 0}, props), jsons
    );
    return [line, jsons];
  }, []);
  return (
    <Container visible={props.visible}>
      {jC[1]}
      {[...Array(props.lines!-jC[0])].map((_, i) => (
        <TextAt key={`${jC[0]+1+i}/-3`}
          text={`${('  ' + (jC[0]+1+i)).slice(-2)}`} col={0x666666}
          x={props.x} y={props.y} lH={props.lH} line={jC[0]+1+i} posX={-3}
        />
      ))}
    </Container>
  )
});

const TextAt = memo(function TextAt_(props: {
  x: number,
  y: number,
  line: number,
  lH: number,
  posX: number,
  text: string,
  col: number,
  interactive?: boolean,
  buttonMode?: boolean,
  pointertap?: () => void
}) {
  return (
    <UText text={props.text} col={props.col}
      x={props.x+(3+props.posX)*props.lH*0.48}
      y={props.y+props.lH*(props.line-0.9)}
      h={props.lH*0.8}
      interactive={props.interactive ?? false}
      buttonMode={props.buttonMode ?? false}
      pointertap={props.pointertap}
    />
  )
});

export { JsonContainer };