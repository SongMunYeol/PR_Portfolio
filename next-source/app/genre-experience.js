'use client';

import {useContext} from 'react';
import {coversPerGenre} from './genre-catalog';
import {InlineContext, EditableText} from './inline-edit';

export default function GenreExperience({genres, indices, pageIndex, Image, onManageGenre}) {
  const {editing, update, pendingUploads} = useContext(InlineContext);

  return <section className="screen game-library-screen" key={pageIndex} aria-labelledby="game-library-title">
    <h2 id="game-library-title" className="kicker">GAME LIBRARY / {String(pageIndex + 1).padStart(2, '0')}</h2>
    <div className="game-library-grid">
      {indices.map(genreIndex => {
        const {name, games} = genres[genreIndex];
        const gamesPath = ['genres', genreIndex, 'games'];
        return <section className="game-genre-panel" key={genreIndex} aria-labelledby={`game-genre-${genreIndex}`}>
          <h3 id={`game-genre-${genreIndex}`}>{name}</h3>
          <div className="game-genre-collection">
            <div className="game-genre-header">
              <span>TITLES <b>{String(games.length).padStart(2, '0')}</b></span>
              {editing && <div className="game-cover-actions">
                <button type="button" disabled={pendingUploads > 0 || games.length >= 100} onClick={() => update(gamesPath, list => {
                  const newGame = {name:'새 게임', image:'', playTime:'', description:''};
                  return list.length < coversPerGenre ? [...list, newGame] : [newGame, ...list];
                })}>+ 게임 추가</button>
                <button type="button" disabled={pendingUploads > 0} onClick={() => onManageGenre(genreIndex)}>게임 관리</button>
              </div>}
            </div>
            <div className="game-cover-grid">
              {games.slice(0, coversPerGenre).map((game, index) => {
                const path = [...gamesPath, index];
                return <article className="game-cover-card" key={index}>
                  <div className="game-cover-frame"><Image path={[...path, 'image']} src={game.image} alt={`${game.name} 표지`}/></div>
                  {editing && <div className="game-cover-actions">
                    {game.image && <button type="button" disabled={pendingUploads > 0} onClick={() => update([...path, 'image'], '')}>표지 삭제</button>}
                    <button type="button" disabled={pendingUploads > 0} onClick={() => update(gamesPath, list => list.filter((_, position) => position !== index))}>게임 삭제</button>
                  </div>}
                  <h4><EditableText multiline path={[...path, 'name']}>{game.name}</EditableText></h4>
                  {(editing || game.playTime?.trim()) && <div className="game-cover-note">
                    <EditableText multiline path={[...path, 'playTime']} label="플레이 기록" placeholder="예: 1000h">{game.playTime}</EditableText>
                  </div>}
                  {(editing || game.description?.trim()) && <div className="game-cover-note">
                    <EditableText multiline path={[...path, 'description']} label="게임 설명" placeholder="설명 입력 · Enter로 줄바꿈">{game.description}</EditableText>
                  </div>}
                </article>;
              })}
            </div>
            {!games.length && <p className="game-cover-empty">등록된 게임 없음</p>}
          </div>
        </section>;
      })}
    </div>
  </section>;
}
