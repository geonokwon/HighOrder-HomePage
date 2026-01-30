import React, { useCallback, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import ReactFlow, {
  MiniMap, Controls, Background, addEdge, useNodesState, useEdgesState, Handle, Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Box, Button, IconButton, Accordion, AccordionSummary, AccordionDetails, TextField, Collapse } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';
import CardCarouselNode from './CardCarouselNode';

// --- 커스텀 노드: MUI Accordion, 라벨 인라인 편집 지원, 접힘/펼침에 따라 Handle 동적 렌더링 ---
const OptionNode = ({ data, id }) => {
  const [expanded, setExpanded] = useState(true);
  const [editingLabel, setEditingLabel] = useState(false);
  const [labelDraft, setLabelDraft] = useState(data.label || '');

  const finishEditLabel = () => {
    setEditingLabel(false);
    data.onChangeLabel(id, labelDraft);
  };

  const handleBlur = () => {
    finishEditLabel();
    data.onTextInputBlur();
  };

  return (
    <Accordion expanded={expanded} onChange={(_, isExpanded) => { if (!editingLabel) setExpanded(isExpanded); }} sx={{ minWidth: 320, boxShadow: 2, mb: 1 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ fontWeight: 'bold', fontSize: 18, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }} onClick={e => { if (editingLabel) e.stopPropagation(); }}>
          {editingLabel ? (
            <>
              <TextField
                value={labelDraft}
                onChange={e => setLabelDraft(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={e => { if (e.key === 'Enter') finishEditLabel(); }}
                size="small"
                autoFocus
                sx={{ mr: 1, minWidth: 120 }}
                onFocus={data.onTextInputFocus}
              />
              <IconButton size="small" color="primary" onClick={finishEditLabel} sx={{ ml: 0.5 }}>
                <CheckIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            <>
              <span style={{ fontWeight: 700, fontSize: 18, verticalAlign: 'middle', display: 'inline-block' }}>{data.label || '노드 제목(라벨)'}</span>
              <IconButton size="small" component="span" sx={{ ml: 1, verticalAlign: 'middle' }} onClick={e => { e.stopPropagation(); setLabelDraft(data.label || ''); setEditingLabel(true); }}>
                <EditIcon fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ pt: 1, pb: 1 }}>
        <TextField
          label="메시지"
          value={data.text}
          onChange={e => data.onChangeText(id, e.target.value)}
          multiline
          minRows={3}
          fullWidth
          sx={{ mb: 2 }}
          onFocus={data.onTextInputFocus}
          onBlur={data.onTextInputBlur}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {expanded && data.options.map((opt, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', position: 'relative', height: 40, gap: 1.5 }}>
              <TextField
                value={opt.label}
                onChange={e => data.onChangeOption(id, idx, e.target.value)}
                label={`옵션 ${idx + 1}`}
                size="small"
                sx={{ flex: 1 }}
                onFocus={data.onTextInputFocus}
                onBlur={data.onTextInputBlur}
              />
              <Handle
                type="source"
                position={Position.Right}
                id={`option-${idx}`}
                style={{
                  background: '#1976d2',
                  width: 14,
                  height: 14,
                  right: -24,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  position: 'absolute'
                }}
              />
              <IconButton size="small" onClick={() => data.onDeleteOption(id, idx)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
        <Button variant="text" size="small" onClick={() => data.onAddOption(id)} sx={{ mt: 1, color: '#1976d2' }}>+ 옵션 추가</Button>
      </AccordionDetails>
      {!expanded && (
        <Handle
          type="source"
          position={Position.Right}
          id={undefined}
          style={{
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            background: '#1976d2',
            width: 16,
            height: 16,
            zIndex: 2,
            position: 'absolute'
          }}
        />
      )}
      <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
    </Accordion>
  );
};

// --- 커스텀 노드: 메인 노드 (텍스트만) ---
const MainNode = ({ data, id }) => {
  const [expanded, setExpanded] = useState(true);
  return (
    <Accordion expanded={expanded} onChange={(_, isExpanded) => setExpanded(isExpanded)} sx={{ minWidth: 320, boxShadow: 2, mb: 1, bgcolor: '#fff' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ fontWeight: 'bold', fontSize: 18 }}>
        <span style={{ fontWeight: 700, fontSize: 18 }}>메인 노드</span>
      </AccordionSummary>
      <AccordionDetails>
        <TextField
          label="메인 텍스트/슬로건"
          value={data.text}
          onChange={e => data.onChangeText(id, e.target.value)}
          multiline
          minRows={3}
          fullWidth
          onFocus={data.onTextInputFocus}
          onBlur={data.onTextInputBlur}
        />
      </AccordionDetails>
    </Accordion>
  );
};

const nodeTypes = { optionNode: OptionNode, cardCarouselNode: CardCarouselNode, main: MainNode };

const initialNodes = [
  {
    id: '1',
    type: 'optionNode',
    data: {
      label: '안녕하세요! 무엇이 궁금하신가요?',
      text: '상담을 시작합니다.',
      options: [
        { label: '플랜 연장' },
        { label: '결제 취소' },
        { label: '환불 문의' }
      ]
    },
    position: { x: 100, y: 100 }
  },
  {
    id: '2',
    type: 'optionNode',
    data: {
      label: '플랜 연장 안내',
      text: '플랜 연장 관련 안내입니다.',
      options: [ { label: '처음으로' } ]
    },
    position: { x: 400, y: 60 }
  }
];

const initialEdges = [
  { id: 'e1-2', source: '1', sourceHandle: 'option-0', target: '2' }
];

const ScenarioFlowEditor = forwardRef((props, ref) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [isTextInputActive, setIsTextInputActive] = useState(false);

  // 텍스트 입력 활성화 상태를 추적하는 함수
  const handleTextInputFocus = () => {
    setIsTextInputActive(true);
  };

  const handleTextInputBlur = () => {
    setIsTextInputActive(false);
  };

  // 시나리오 데이터 서버에서 항상 불러오기 (없으면 init)
  useEffect(() => {
    fetch('/api/scenario', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        const scenario = Array.isArray(data) ? data[0] : data;
        if (scenario && scenario.messages && scenario.messages.length > 0) {
          // 서버 데이터로 노드/엣지 변환
          const loadedNodes = scenario.messages.map((msg, idx) => {
            if (msg.type === 'cardCarouselNode') {
              return {
                id: msg.id,
                type: 'cardCarouselNode',
                data: {
                  cards: msg.cards || [],
                  onAddCard: handleAddCard,
                  onDeleteCard: handleDeleteCard,
                  onChangeCardImage: handleChangeCardImage,
                  onChangeCardDesc: handleChangeCardDesc,
                  onChangeCardButtonText: handleChangeCardButtonText,
                  onChangeCardButtonUrl: handleChangeCardButtonUrl,
                  onChangeCardsOrder: handleChangeCardsOrder
                },
                position: msg.position || { x: 120 + (idx % 4) * 220, y: 80 + Math.floor(idx / 4) * 180 }
              };
            }
            if (msg.type === 'main') {
              return {
                id: msg.id,
                type: 'main',
                data: {
                  text: msg.text,
                  onChangeText: handleChangeText
                },
                position: msg.position || { x: 120 + (idx % 4) * 220, y: 80 + Math.floor(idx / 4) * 180 }
              };
            }
            // 기존 optionNode 처리
            return {
              id: msg.id,
              type: 'optionNode',
              data: {
                label: msg.label || '',
                text: msg.text || '',
                options: (msg.options || []).map(opt => ({ label: opt.label })),
                onAddOption: handleAddOption,
                onDeleteOption: handleDeleteOption,
                onChangeLabel: handleChangeLabel,
                onChangeText: handleChangeText,
                onChangeOption: handleChangeOption
              },
              position: msg.position || { x: 120 + (idx % 4) * 220, y: 80 + Math.floor(idx / 4) * 180 }
            };
          });
          const loadedEdges = [];
          scenario.messages.forEach((msg, nodeIdx) => {
            if (msg.type === 'cardCarouselNode') return;
            (msg.options || []).forEach((opt, optIdx) => {
              if (opt.nextMessageId) {
                loadedEdges.push({
                  id: `e-${msg.id}-${opt.nextMessageId}-${optIdx}`,
                  source: msg.id,
                  sourceHandle: `option-${optIdx}`,
                  target: opt.nextMessageId
                });
              }
            });
          });
          setNodes(loadedNodes);
          setEdges(loadedEdges);
        } else {
          // 데이터 없으면 초기값 사용
          setNodes(initialNodes);
          setEdges(initialEdges);
        }
      });
  }, []);

  // 옵션 추가
  const handleAddOption = useCallback((nodeId) => {
    setNodes((nds) => nds.map((n) =>
      n.id === nodeId
        ? { ...n, data: { ...n.data, options: [...n.data.options, { label: '새 옵션' }] } }
        : n
    ));
  }, [setNodes]);

  // 옵션 삭제
  const handleDeleteOption = useCallback((nodeId, optIdx) => {
    setNodes((nds) => nds.map((n) =>
      n.id === nodeId
        ? { ...n, data: { ...n.data, options: n.data.options.filter((_, i) => i !== optIdx) } }
        : n
    ));
    setEdges((eds) => eds.filter(e => !(e.source === nodeId && e.sourceHandle === `option-${optIdx}`)));
  }, [setNodes, setEdges]);

  // label 변경
  const handleChangeLabel = useCallback((nodeId, value) => {
    setNodes((nds) => nds.map((n) =>
      n.id === nodeId
        ? { ...n, data: { ...n.data, label: value } }
        : n
    ));
  }, [setNodes]);

  // 메시지(텍스트) 변경
  const handleChangeText = useCallback((nodeId, value) => {
    setNodes((nds) => nds.map((n) =>
      n.id === nodeId
        ? { ...n, data: { ...n.data, text: value } }
        : n
    ));
  }, [setNodes]);

  // 옵션 라벨 변경
  const handleChangeOption = useCallback((nodeId, optIdx, value) => {
    setNodes((nds) => nds.map((n) =>
      n.id === nodeId
        ? { ...n, data: { ...n.data, options: n.data.options.map((opt, i) => i === optIdx ? { ...opt, label: value } : opt) } }
        : n
    ));
  }, [setNodes]);

  // 카드형 노드 관련 핸들러
  const handleAddCard = useCallback((nodeId) => {
    setNodes((nds) => nds.map((n) =>
      n.id === nodeId
        ? { ...n, data: { ...n.data, cards: [...(n.data.cards || []), { image: '', desc: '', buttonText: '' }] } }
        : n
    ));
  }, [setNodes]);
  const handleDeleteCard = useCallback((nodeId, cardIdx) => {
    setNodes((nds) => nds.map((n) =>
      n.id === nodeId
        ? { ...n, data: { ...n.data, cards: n.data.cards.filter((_, i) => i !== cardIdx) } }
        : n
    ));
  }, [setNodes]);
  const handleChangeCardImage = useCallback((nodeId, cardIdx, url) => {
    setNodes((nds) => nds.map((n) =>
      n.id === nodeId
        ? { ...n, data: { ...n.data, cards: n.data.cards.map((c, i) => i === cardIdx ? { ...c, image: url } : c) } }
        : n
    ));
  }, [setNodes]);
  const handleChangeCardDesc = useCallback((nodeId, cardIdx, value) => {
    setNodes((nds) => nds.map((n) =>
      n.id === nodeId
        ? { ...n, data: { ...n.data, cards: n.data.cards.map((c, i) => i === cardIdx ? { ...c, desc: value } : c) } }
        : n
    ));
  }, [setNodes]);
  const handleChangeCardButtonText = useCallback((nodeId, cardIdx, value) => {
    setNodes((nds) => nds.map((n) =>
      n.id === nodeId
        ? { ...n, data: { ...n.data, cards: n.data.cards.map((c, i) => i === cardIdx ? { ...c, buttonText: value } : c) } }
        : n
    ));
  }, [setNodes]);
  const handleChangeCardButtonUrl = useCallback((nodeId, cardIdx, value) => {
    setNodes((nds) => nds.map((n) =>
      n.id === nodeId
        ? { ...n, data: { ...n.data, cards: n.data.cards.map((c, i) => i === cardIdx ? { ...c, buttonUrl: value } : c) } }
        : n
    ));
  }, [setNodes]);
  // 카드 순서 변경 핸들러
  const handleChangeCardsOrder = useCallback((nodeId, newCards) => {
    setNodes((nds) => nds.map((n) =>
      n.id === nodeId
        ? { ...n, data: { ...n.data, cards: newCards } }
        : n
    ));
  }, [setNodes]);

  // 노드 추가 핸들러 분리
  const internalHandleAddNodeType = (type) => {
    const newId = `${Date.now()}`;
    if (type === 'cardCarouselNode') {
      setNodes((nds) => [
        ...nds,
        {
          id: newId,
          type: 'cardCarouselNode',
          data: {
            cards: [ { image: '', desc: '', buttonText: '' } ],
            onAddCard: handleAddCard,
            onDeleteCard: handleDeleteCard,
            onChangeCardImage: handleChangeCardImage,
            onChangeCardDesc: handleChangeCardDesc,
            onChangeCardButtonText: handleChangeCardButtonText,
            onChangeCardButtonUrl: handleChangeCardButtonUrl,
            onChangeCardsOrder: handleChangeCardsOrder
          },
          position: { x: 200 + Math.random() * 200, y: 200 + Math.random() * 100 }
        }
      ]);
      return;
    }
    if (type === 'main') {
      setNodes((nds) => [
        ...nds,
        {
          id: newId,
          type: 'main',
          data: {
            text: '',
            onChangeText: handleChangeText
          },
          position: { x: 200 + Math.random() * 200, y: 200 + Math.random() * 100 }
        }
      ]);
      return;
    }
    setNodes((nds) => [
      ...nds,
      {
        id: newId,
        type: 'optionNode',
        data: {
          label: '',
          text: '',
          options: [ { label: '옵션1' } ],
          onAddOption: handleAddOption,
          onDeleteOption: handleDeleteOption,
          onChangeLabel: handleChangeLabel,
          onChangeText: handleChangeText,
          onChangeOption: handleChangeOption
        },
        position: { x: 200 + Math.random() * 200, y: 200 + Math.random() * 100 }
      }
    ]);
  };

  // 저장: 노드/엣지 → scenario.json 구조로 변환 후 POST (position 포함) 
  const handleSaveScenario = async () => {
    const messages = nodes.map((node) => {
      if (node.type === 'main') {
        return {
          id: node.id,
          type: 'main',
          text: node.data.text,
          position: node.position
        };
      }
      if (node.type === 'cardCarouselNode') {
        return {
          id: node.id,
          type: 'cardCarouselNode',
          cards: node.data.cards,
          position: node.position
        };
      }
      // 기존 optionNode 처리
      const nodeOptions = (node.data.options || []).map((opt, idx) => {
        const edge = edges.find(e => e.source === node.id && e.sourceHandle === `option-${idx}`);
        return {
          label: opt.label,
          nextMessageId: edge ? edge.target : undefined
        };
      });
      return {
        id: node.id,
        sender: 'bot',
        text: node.data.text,
        label: node.data.label,
        position: node.position,
        options: nodeOptions
      };
    });
    const scenario = { name: 'perfume', messages };
    await fetch('/api/scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scenario),
      credentials: 'include',
    });
    alert('저장 완료!');
  };

  // 불러오기: scenario.json → 노드/엣지로 변환 (position 반영)
  const handleLoadScenario = async () => {
    const res = await fetch('/api/scenario', {
      credentials: 'include',
    });
    const data = await res.json();
    const scenario = Array.isArray(data) ? data[0] : data;
    if (!scenario || !scenario.messages) return;
    const loadedNodes = scenario.messages.map((msg, idx) => {
      if (msg.type === 'cardCarouselNode') {
        return {
          id: msg.id,
          type: 'cardCarouselNode',
          data: {
            cards: msg.cards || [],
            onAddCard: handleAddCard,
            onDeleteCard: handleDeleteCard,
            onChangeCardImage: handleChangeCardImage,
            onChangeCardDesc: handleChangeCardDesc,
            onChangeCardButtonText: handleChangeCardButtonText,
            onChangeCardButtonUrl: handleChangeCardButtonUrl,
            onChangeCardsOrder: handleChangeCardsOrder
          },
          position: msg.position || { x: 120 + (idx % 4) * 220, y: 80 + Math.floor(idx / 4) * 180 }
        };
      }
      if (msg.type === 'main') {
        return {
          id: msg.id,
          type: 'main',
          data: {
            text: msg.text,
            onChangeText: handleChangeText
          },
          position: msg.position || { x: 120 + (idx % 4) * 220, y: 80 + Math.floor(idx / 4) * 180 }
        };
      }
      // 기존 optionNode 처리
      return {
        id: msg.id,
        type: 'optionNode',
        data: {
          label: msg.label || '',
          text: msg.text || '',
          options: (msg.options || []).map(opt => ({ label: opt.label })),
          onAddOption: handleAddOption,
          onDeleteOption: handleDeleteOption,
          onChangeLabel: handleChangeLabel,
          onChangeText: handleChangeText,
          onChangeOption: handleChangeOption
        },
        position: msg.position || { x: 120 + (idx % 4) * 220, y: 80 + Math.floor(idx / 4) * 180 }
      };
    });
    const loadedEdges = [];
    scenario.messages.forEach((msg, nodeIdx) => {
      if (msg.type === 'cardCarouselNode') return;
      (msg.options || []).forEach((opt, optIdx) => {
        if (opt.nextMessageId) {
          loadedEdges.push({
            id: `e-${msg.id}-${opt.nextMessageId}-${optIdx}`,
            source: msg.id,
            sourceHandle: `option-${optIdx}`,
            target: opt.nextMessageId
          });
        }
      });
    });
    setNodes(loadedNodes);
    setEdges(loadedEdges);
  };

  // onConnect 함수
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // 엣지 클릭 핸들러
  const onEdgeClick = useCallback((event, edge) => {
    setSelectedEdgeId(edge.id);
  }, []);

  // 빈 곳(배경) 클릭 핸들러
  const onPaneClick = useCallback(() => {
    setSelectedEdgeId(null);
  }, []);

  // 노드 클릭 핸들러
  const onNodeClick = useCallback(() => {
    setSelectedEdgeId(null);
  }, []);

  // 노드 데이터에 텍스트 입력 핸들러 추가
  const nodesWithHandlers = nodes.map(n => {
    if (n.type === 'cardCarouselNode') {
      return {
        ...n,
        data: {
          ...n.data,
          onAddCard: handleAddCard,
          onDeleteCard: handleDeleteCard,
          onChangeCardImage: handleChangeCardImage,
          onChangeCardDesc: handleChangeCardDesc,
          onChangeCardButtonText: handleChangeCardButtonText,
          onChangeCardButtonUrl: handleChangeCardButtonUrl,
          onChangeCardsOrder: handleChangeCardsOrder,
          onTextInputFocus: handleTextInputFocus,
          onTextInputBlur: handleTextInputBlur
        }
      };
    }
    if (n.type === 'main') {
      return {
        ...n,
        data: {
          ...n.data,
          onChangeText: handleChangeText,
          onTextInputFocus: handleTextInputFocus,
          onTextInputBlur: handleTextInputBlur
        }
      };
    }
    return {
      ...n,
      data: {
        ...n.data,
        onAddOption: handleAddOption,
        onDeleteOption: handleDeleteOption,
        onChangeLabel: handleChangeLabel,
        onChangeText: handleChangeText,
        onChangeOption: handleChangeOption,
        onTextInputFocus: handleTextInputFocus,
        onTextInputBlur: handleTextInputBlur
      }
    };
  });

  useImperativeHandle(ref, () => ({
    handleAddNodeType: internalHandleAddNodeType,
    handleSaveScenario,
    handleLoadScenario,
  }));

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex' }}>
      {/* 플로우 에디터 */}
      <Box sx={{ flex: 1, height: '100%', position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 10, minWidth: 220 }}>
          <Collapse in={props.addNodeOpen}>
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2, mt: 1, boxShadow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button variant="outlined" onClick={() => props.handleAddNodeType('optionNode')}>텍스트/옵션 노드 추가</Button>
              <Button variant="outlined" onClick={() => props.handleAddNodeType('cardCarouselNode')}>카드형 노드 추가</Button>
              <Button variant="outlined" onClick={() => props.handleAddNodeType('main')}>메인 노드 추가</Button>
            </Box>
          </Collapse>
        </Box>
        <div style={{ width: '100%', height: '100%' }}>
          <ReactFlow
            nodes={nodesWithHandlers}
            edges={edges.map(edge => ({
              ...edge,
              style: {
                stroke: selectedEdgeId === edge.id ? '#1976d2' : '#555',
                strokeWidth: selectedEdgeId === edge.id ? 4 : 1
              }
            }))}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            connectionMode="loose"
            nodesDraggable={!isTextInputActive}
            panOnDrag={!isTextInputActive}
            panOnScroll={!isTextInputActive}
            zoomOnScroll={!isTextInputActive}
            preventScrolling={isTextInputActive}
          >
            <MiniMap 
              position="bottom-right"
              style={{ bottom: 60, right: 20 }}
            />
            <Controls 
              position="bottom-left"
              style={{ bottom: 100, left: 20 }}
            />
            <Background />
          </ReactFlow>
        </div>
      </Box>
    </Box>
  );
});

export default ScenarioFlowEditor; 