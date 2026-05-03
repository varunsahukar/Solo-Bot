from agents.state import AgentState
VALID_TASKS = {'chat', 'quiz', 'code', 'video'}
def route_task(state: AgentState) -> str:
    task = state.get('task_type', '')
    if task not in VALID_TASKS: raise ValueError(f'Unknown task_type {task}')
    return f'{task}_agent'
