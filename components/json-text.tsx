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
  alpha?: number,
  lines?: number
};

const jsonContainer = (props: Props): [number, number, ReactElement] => {
  const jsons = [];
  const gProps = {
    line: props.line!, depth: props.depth!, posX: props.posX!
  };
  if (props.posX === 0)
    jsons.push(<LineNumText key={`${gProps.line}/-3`}
      x={props.x} y={props.y} lH={props.lH} line={gProps.line}
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
      jsons.push(<LineNumText key={`${gProps.line}/-3`}
        x={props.x} y={props.y} lH={props.lH} line={gProps.line}
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
      let cJson;
      [gProps.posX, gProps.line, cJson] = jsonContainer(Object.assign({
        x: props.x, y: props.y, lH: props.lH, json: props.json[key]
      }, gProps));
      jsons.push(cJson);
      f = true;
    }
    gProps.line++;gProps.depth--;

    jsons.push(<LineNumText key={`${gProps.line}/-3`}
      x={props.x} y={props.y} lH={props.lH} line={gProps.line}
    />);
    gProps.posX = gProps.depth*2;
    jsons.push(
      <TextAt key={`${gProps.line}/${gProps.posX}`}
        text={(props.json instanceof Array) ? ']' : '}'} col={0x000000}
        x={props.x} y={props.y} lH={props.lH}
        line={gProps.line} posX={gProps.posX}
      />
    );
    return [gProps.posX+1, gProps.line,
      <Container key={`c${gProps.line}/${gProps.posX}`}>
        {jsons.map((e, _) => e)}
      </Container>
    ];
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
  return [gProps.posX+props.json.length+2, gProps.line,
    <Container key={`c${gProps.line}/${gProps.posX}`}>
      {jsons.map((e, _) => e)}
    </Container>
  ];
}

const JsonContainer = memo(function JsonContainer_(props: Props) {
  const jC = useMemo(() => {
    return jsonContainer(Object.assign({posX: 0, line: 1, depth: 0}, props));
  }, []);
  return (
    <Container alpha={props.alpha}>
      {jC[2]}
      {[...Array(props.lines!-jC[1])].map((_, i) => (
        <LineNumText key={`${jC[1]+1+i}/-3`}
          x={props.x} y={props.y} lH={props.lH} line={jC[1]+1+i}
        />
      ))}
    </Container>
  )
});

const LineNumText = memo(function LineNumText_(props: {
  x: number,
  y: number,
  line: number,
  lH: number
}) {
  return (
    <TextAt text={`${('  ' + props.line).slice(-2)}`} col={0x666666}
      x={props.x} y={props.y} lH={props.lH} line={props.line} posX={-3}
    /> 
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

export { JsonContainer, LineNumText };