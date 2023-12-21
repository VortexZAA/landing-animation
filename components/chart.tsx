'use strict';
import React, { use, useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  applyEdgeChanges,
  applyNodeChanges,
  MiniMap,
  MarkerType,
  Controls,
} from "reactflow";
/* import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  MarkerType,
  isNode
} from "reactflow"; */
import dagre from "dagre";
import CardPlus from "@/components/cards/userPlus";
import {
  callCalculateChildRevenue,
  callGetNFTInfo,
  parseIntHex,
} from "@/contractInteractions/useAppContract";
import { ethers } from "ethers";
import { selectData, setLoading } from "@/redux/auth/auth";
import { useAppDispatch, useAppSelector } from "@/hook/redux/hooks";
import Loader from "./Loader";
import { useSelector } from "react-redux";
const nodeWidth = 300;
const nodeHeight = 150;

/* const initialEdges = [
  {
    id: "edges-e5-7",
    source: "0",
    target: "1",
    // animated: true, 
    label: "+",
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: "#FFCC00", color: "#fff", fillOpacity: 0.7 },
    //  markerEnd: {
    //  type: MarkerType.ArrowClosed,
    //},
  },
]; */

const nodeTypes: any = {
  card: CardPlus,
};

const FlowChartWithAutoLayout = ({
  tokenId,
}: {
  tokenId: number | boolean;
}) => {
  const layoutedElements = useCallback(
    async (nodes: any, edges: any, direction = "TB") => {
      const dagreGraph = new dagre.graphlib.Graph();
      dagreGraph.setDefaultEdgeLabel(() => ({}));
      dagreGraph.setGraph({ rankdir: direction });

      await nodes.forEach((node: any) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
      });

      await edges.forEach((edge: any) => {
        dagreGraph.setEdge(edge.source, edge.target);
      });

      dagre.layout(dagreGraph);

      await nodes.forEach((node: any) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = "top";
        node.sourcePosition = "bottom";

        // We are shifting the dagre node position (top left corner) to the center of the node for React Flow
        node.position = {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        };

        return node;
      });

      return { nodes, edges };
    },
    []
  );
  const [nodes, setNodes] = useState<any>([]);
  const [edges, setEdges] = useState<any>([]);

  const [reactFlowInstance, setReactFlowInstance]: any = useState(null);
  const reactFlowWrapper = useRef(null);
  const [change, setChange] = useState(false);
  useEffect(() => {
    /*  setTimeout(
      () =>
        //@ts-ignore
        document
          ?.querySelector(".react-flow__renderer")
          ?.animate([{ transform: "scale(10)" }, { transform: "scale(1)" }], {
            duration: 666,
            easing: "ease",
          }),
      100
    ); */
  }, []);
  async function forceAutoLayout() {
    const { nodes: layoutedNodes, edges: layoutedEdges } =
      await layoutedElements(nodes, edges);
    //@ts-ignore
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
    //@ts-ignore
    reactFlowInstance?.fitView();
  }
  const onInit = (rfi: any) => {
    if (!rfi) return;
    setReactFlowInstance(rfi);
  };

  useEffect(() => {
    forceAutoLayout();

    //console.log("nodes", nodes);
  }, [reactFlowInstance, nodes.length]);
  useEffect(() => {
    //@ts-ignore
    reactFlowInstance?.fitView();
  });

  const reduxData = useSelector(selectData);
  const { nftInfo: data } = reduxData;
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  async function getfirsNftInfo() {
    try {
      setLoading(true);
      if (tokenId) {
        let getNFTInfo = await callGetNFTInfo(tokenId as number);
        //console.log("getNFTInfo", getNFTInfo);
        let contractData = {
          vipLvl: parseIntHex(getNFTInfo[0]),
          id: parseIntHex(getNFTInfo[1]),
          holder: getNFTInfo[2],
          parent: parseIntHex(getNFTInfo[3]),
          //claimLimit: ethers.utils.formatEther(getNFTInfo[4]),
          leftChild: parseIntHex(getNFTInfo[4]),
          rightChild: parseIntHex(getNFTInfo[5]),
        };
        //console.log(contractData);
        let revenue = await callCalculateChildRevenue(tokenId as number);
        //console.log(revenue);
        let childData = {
          leftChildRevenue: ethers.utils.formatEther(revenue[0]),
          rightChildRevenue: ethers.utils.formatEther(revenue[1]),
        };
        //console.log(childData);
        let datas = {
          id: contractData.id.toString(),
          name: "a",
          address: contractData.holder,
          leftChildRevenue: childData.leftChildRevenue,
          rightChildRevenue: childData.rightChildRevenue,
          vipLvl: contractData.vipLvl,
          parent: contractData.parent.toString(),
          count:
            (contractData.leftChild === 0 ? 0 : 1) +
            (contractData.rightChild === 0 ? 0 : 1),
          children: [
            {
              id: contractData.leftChild,
              name: "b",
              parent: contractData.id.toString(),
              children: [],
            },
            {
              id: contractData.rightChild,
              name: "c",
              parent: contractData.id.toString(),
              children: [],
            },
          ],
        };
        datas.children = datas.children.filter((item: any) => item.id !== 0);
        //@ts-ignore
        datas &&
          setNodes([
            ...[datas].map((item: any) => {
              return {
                id: item?.id,
                type: "card", //item?.children?.length ? "input" : "output",
                parentID: item?.id,
                data: {
                  label: item?.id,
                  address: item?.address,
                  leftChildRevenue: item?.leftChildRevenue,
                  rightChildRevenue: item?.rightChildRevenue,
                  vipLvl: item?.vipLvl,
                  count: item?.count,
                  children: item?.children,
                  parent: item?.parent,
                  index: 0,
                  first: true,
                  childrenStatus: item?.children?.length > 0 ? true : false,
                  open: false,
                },
                position: { x: 0, y: 0 },
                sourcePosition: "bottom",
                targetPosition: "top",
                animated: true,
              };
            }),
          ]);
      }
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    //forceLayout();
    //console.log("data", data);
    if (tokenId) {
      getfirsNftInfo();
    } else if (data) {
      //@ts-ignore
      setNodes([
        ...data.map((item: any) => {
          return {
            id: item?.id,
            type: "card", //item?.children?.length ? "input" : "output",
            parentID: item?.id,
            data: {
              label: item?.id,
              address: item?.address,
              leftChildRevenue: item?.leftChildRevenue,
              rightChildRevenue: item?.rightChildRevenue,
              vipLvl: item?.vipLvl,
              count: item?.count,
              children: item?.children,
              parent: item?.parent,
              index: 0,
              first: true,
              childrenStatus: item?.children?.length > 0 ? true : false,
              open: false,
            },
            position: { x: 0, y: 0 },
            sourcePosition: "bottom",
            targetPosition: "top",
            /* animated: true, */
          };
        }),
      ]);
      setLoading(false);
    }
  }, [data]);

  const handleNodeClick = async (e: any, data: any) => {
    try {
      setLoading(true);
      const findChildren = nodes.filter(
        (item: any) => item?.data?.parent === data.id
      );
      //console.log("datass", data);

      let newNodes: any = [...nodes];
      if (!findChildren.length) {
        const itemChildren = await Promise.all([
          ...data.data.children.map(async (item: any, i: number) => {
            //console.log("item", item);
            
            let getNFTInfo = await callGetNFTInfo(Number(item.id));
            //console.log("getNFTInfo", getNFTInfo);
            let contractData = {
              vipLvl: parseIntHex(getNFTInfo[0]),
              id: parseIntHex(getNFTInfo[1]),
              holder: getNFTInfo[2],
              parent: parseIntHex(getNFTInfo[3]),
              //claimLimit: ethers.utils.formatEther(getNFTInfo[4]),
              leftChild: parseIntHex(getNFTInfo[4]),
              rightChild: parseIntHex(getNFTInfo[5]),
            };
            //console.log(contractData);
            let revenue = await callCalculateChildRevenue(Number(item.id));
            //console.log(revenue);
            let childData = {
              leftChildRevenue: ethers.utils.formatEther(revenue[0]),
              rightChildRevenue: ethers.utils.formatEther(revenue[1]),
            };
            //console.log(childData);
            let datas = {
              id: contractData.id.toString(),
              name: "a",
              parentID: data.parentID + "." + contractData.id.toString(),
              address: contractData.holder,
              leftChildRevenue: childData.leftChildRevenue,
              rightChildRevenue: childData.rightChildRevenue,
              vipLvl: contractData.vipLvl,
              parent: contractData.parent.toString(),
              count:
                (contractData.leftChild === 0 ? 0 : 1) +
                (contractData.rightChild === 0 ? 0 : 1),
              children: [
                {
                  id: contractData.leftChild,
                  name: "b",
                  parent: item.id.toString(),
                  children: [],
                },
                {
                  id: contractData.rightChild,
                  name: "c",
                  parent: item.id.toString(),
                  children: [],
                },
              ],
            };
            datas.children = datas.children.filter(
              (item: any) => item.id !== 0
            );
            return {
              id: datas.id,
              parentID: datas.parentID,
              type: "card", //item?.children?.length ? "default" : "output",
              data: {
                label: datas?.id,
                address: datas?.address,
                leftChildRevenue: datas?.leftChildRevenue,
                rightChildRevenue: datas?.rightChildRevenue,
                vipLvl: datas?.vipLvl,
                count: datas?.count,
                children: datas?.children,
                parent: item?.parent,
                index: i,
                first: false,
                childrenStatus: datas?.children?.length > 0 ? true : false,
                open: false,
              },
              position: {
                x: 0,
                y: 0,
              },
              sourcePosition: "bottom",
              targetPosition: i === 0 ? "right" : "left",
            };
          }),
        ]);
        //@ts-ignore
        setEdges([
          ...edges,
          ...(await Promise.all(
            itemChildren.map(async (item: any, i: number) => {
              return {
                id: String(Number(Math.random() * 1000000)) + '-' + item?.id,
                source: data.id,
                target: item?.id,
                /* animated: true, */
                type: 'smoothstep',
               style: { strokeWidth: 3, stroke: '#E59A49' },
                /* markerEnd: {
                type: MarkerType.ArrowClosed,
              }, */
              };
            })
          )),
        ]);
        newNodes.push(...itemChildren);
        newNodes.map((item: any) => {
          if (item?.id === data.id) {
            item.data.open = true;
          }
        });
        //console.log("newNodes", newNodes);
        setNodes(newNodes);
        setLoading(false);
      } else {
        //console.log("oldu:", '1.2.1'.substring(0,data.id.length).includes(data.id), data?.id);
        newNodes = [...nodes];
        newNodes.map((item: any) => {
          if (item?.id === data.id) {
            item.data.open = false;
          }
        });
        //@ts-ignore
        setNodes([
          ...newNodes.filter(
            (item: any) =>
              data.id === item.id ||
              !item?.parentID
                .substring(0, data.parentID.length)
                .includes(data.parentID)
          ),
        ]);
        //@ts-ignore
        setEdges([...edges.filter((item) => data.id !== item.source)]);
        setLoading(false);
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };
  //console.log("edges", edges);
  useEffect(() => {
    forceAutoLayout();
  }, [loading]);
  //@ts-ignore
  const onNodesChange = useCallback(
    //@ts-ignore
    (changes: any) => setNodes((nds: any) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds: any) => applyEdgeChanges(changes, eds)),
    []
  );
  return (
    <div className="relative flex w-full h-full">
      {loading && <Loader />}
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onInit={onInit}
        nodesDraggable={false}
        autoPanOnConnect={true}
      >
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
};

export default FlowChartWithAutoLayout;
