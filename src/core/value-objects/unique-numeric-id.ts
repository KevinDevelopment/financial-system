import { MissingDataError } from "../exception";
/**
 * Classe que gera ou encapsula um Snowflake ID.
 * - EPOCH define a data a partir da qual contamos o tempo (ex: 2022-01-01T00:00:00Z).
 * - lastTimestamp armazena o último timestamp utilizado (em milissegundos desde a EPOCH).
 * - sequence é incrementada para gerar vários IDs dentro do mesmo milissegundo.
 * - DATACENTER_ID e WORKER_ID podem ser ajustados conforme sua infraestrutura (até 31).
 * - Retornamos um BigInt para evitar perda de precisão, mas expomos métodos
 *   para convertê-lo em number se necessário (com cuidado quanto ao limite de 2^53).
 */
export class UniqueNumericId {
	// Data inicial de referência (2022-01-01T00:00:00Z). Ajuste conforme necessário.
	private static readonly EPOCH = 1640995200000n;

	// Armazena o último timestamp utilizado no Snowflake (em BigInt).
	private static lastTimestamp: bigint = 0n;

	// Sequência dentro do mesmo milissegundo.
	private static sequence: bigint = 0n;

	// Bits de cada parte do Snowflake (no padrão Twitter: 5 bits datacenter, 5 bits worker, 12 bits sequence).
	private static readonly WORKER_ID_BITS = 5n;
	private static readonly DATACENTER_ID_BITS = 5n;
	private static readonly SEQUENCE_BITS = 12n;

	// Valores máximos (ex: para 5 bits, máximo é 31; para 12 bits, máximo é 4095).
	private static readonly MAX_WORKER_ID =
		(1n << UniqueNumericId.WORKER_ID_BITS) - 1n; // 31
	private static readonly MAX_DATACENTER_ID =
		(1n << UniqueNumericId.DATACENTER_ID_BITS) - 1n; // 31
	private static readonly MAX_SEQUENCE =
		(1n << UniqueNumericId.SEQUENCE_BITS) - 1n; // 4095

	// Deslocamentos (ordem: timestamp << (5+5+12), datacenter << (5+12), worker << 12, sequence).
	private static readonly WORKER_ID_SHIFT = UniqueNumericId.SEQUENCE_BITS;
	private static readonly DATACENTER_ID_SHIFT =
		UniqueNumericId.SEQUENCE_BITS + UniqueNumericId.WORKER_ID_BITS;
	private static readonly TIMESTAMP_LEFT_SHIFT =
		UniqueNumericId.SEQUENCE_BITS +
		UniqueNumericId.WORKER_ID_BITS +
		UniqueNumericId.DATACENTER_ID_BITS;

	// IDs fixos para este “nó” (datacenter e worker).
	// Ajuste conforme sua necessidade. Cada instância ou serviço deve ter seu (datacenterId, workerId) únicos.
	private static readonly DATACENTER_ID = 1n;
	private static readonly WORKER_ID = 1n;

	private readonly _id: bigint;

	/**
	 * Construtor privado: usamos o método `create()` para obter a instância.
	 */
	private constructor(id: bigint) {
		// Se o ID for inválido (<= 0), lança erro.
		if (id <= 0n) {
			throw new MissingDataError("O ID gerado não é válido", 422);
		}
		this._id = id;
		Object.freeze(this);
	}

	/**
	 * Método estático para criar um UniqueNumericId.
	 * - Se `_id` não for passado, gera um Snowflake ID.
	 * - Se `_id` for passado, utiliza-o (precisa ser > 0).
	 */
	public static create(_id?: bigint): UniqueNumericId {
		if (_id === undefined) {
			// Gerar Snowflake
			return new UniqueNumericId(this.generateSnowflakeId());
		} else {
			// Validar o _id informado
			if (_id <= 0) {
				throw new MissingDataError("O ID informado não é válido", 422);
			}
			// Converte para BigInt para manter consistência
			return new UniqueNumericId(BigInt(_id));
		}
	}

	/**
	 * Gera um Snowflake ID com base no timestamp atual, datacenterId, workerId e sequence.
	 */
	private static generateSnowflakeId(): bigint {
		// Tempo atual (em ms), subtraindo a EPOCH. Convertido para BigInt.
		let currentTimestamp = BigInt(Date.now()) - UniqueNumericId.EPOCH;

		// Verifica se o relógio andou para trás
		if (currentTimestamp < UniqueNumericId.lastTimestamp) {
			throw new MissingDataError(
				`O relógio do sistema retrocedeu. Aguardar até ${UniqueNumericId.lastTimestamp - currentTimestamp}ms.`,
				422,
			);
		}

		// Se estamos no mesmo milissegundo que o último ID gerado, incrementamos a sequência
		if (currentTimestamp === UniqueNumericId.lastTimestamp) {
			UniqueNumericId.sequence =
				(UniqueNumericId.sequence + 1n) & UniqueNumericId.MAX_SEQUENCE;

			// Se sequence estourou (4095), aguarda virar o próximo milissegundo
			if (UniqueNumericId.sequence === 0n) {
				currentTimestamp = this.waitNextMillis(currentTimestamp);
			}
		} else {
			// Caso seja um novo milissegundo, zera a sequência
			UniqueNumericId.sequence = 0n;
		}

		UniqueNumericId.lastTimestamp = currentTimestamp;

		// Monta o ID Snowflake (64 bits)
		// timestamp << 22 | datacenterId << 17 | workerId << 12 | sequence
		// Obs: Aqui somamos 5 + 5 + 12 = 22 bits de "componentes" que vão à direita do timestamp
		const id =
			(currentTimestamp << UniqueNumericId.TIMESTAMP_LEFT_SHIFT) |
			(UniqueNumericId.DATACENTER_ID << UniqueNumericId.DATACENTER_ID_SHIFT) |
			(UniqueNumericId.WORKER_ID << UniqueNumericId.WORKER_ID_SHIFT) |
			UniqueNumericId.sequence;

		return id;
	}

	/**
	 * Aguarda até chegarmos em um novo milissegundo, para evitar colisão na sequência.
	 */
	private static waitNextMillis(lastTimestamp: bigint): bigint {
		let timestamp = BigInt(Date.now()) - UniqueNumericId.EPOCH;
		while (timestamp <= lastTimestamp) {
			timestamp = BigInt(Date.now()) - UniqueNumericId.EPOCH;
		}
		return timestamp;
	}

	/**
	 * Retorna o ID interno como BigInt (forma mais segura).
	 */
	public get value(): bigint {
		return this._id;
	}

	/**
	 * Caso precise de `number` ao invés de BigInt, use este getter.
	 * Atenção: acima de 2^53, há risco de perda de precisão em JavaScript.
	 */
	public get asNumber(): number {
		return Number(this._id); // cuidado se ID ficar muito grande ao longo dos anos
	}

	/**
	 * Caso precise de `string` ao invés de BIgInt, use este getter.
	 * 	 */
	public get asString(): string {
		return this._id.toString();
	}
}
